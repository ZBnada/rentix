// src/app/features/entretien/services/entretien-notification.service.ts

import { Injectable, inject, OnDestroy } from '@angular/core';
import { Subject, interval, takeUntil, switchMap } from 'rxjs';
import { EntretienService } from './entretien.service';
import { EntretienAlertService, EntretienAlertType } from './entretien-alert.service';
import { NotificationSoundService } from '../../notifications/services/notification-sound.service';
import { Entretien } from '../models/entretien.model';

@Injectable({
    providedIn: 'root'
})
export class EntretienNotificationService implements OnDestroy {
    private readonly entretienService = inject(EntretienService);
    private readonly alertService = inject(EntretienAlertService);
    private readonly soundService = inject(NotificationSoundService);

    private destroy$ = new Subject<void>();
    private isRunning = false;
    private lastNotifiedIds = new Set<string>();

    // Vérifier toutes les 4 heures (14400000 ms)
    private readonly CHECK_INTERVAL_MS = 14400000;

    // ✅ Suivi de la visibilité de la page
    private isPageVisible = true;

    constructor() {
        // ✅ Écouter les changements de visibilité
        this.setupVisibilityListener();
    }

    /**
     * Écouter les changements de visibilité de la page
     */
    private setupVisibilityListener(): void {
        document.addEventListener('visibilitychange', () => {
            this.isPageVisible = !document.hidden;
            console.log('👁️ Page visibility changed:', this.isPageVisible ? 'visible' : 'hidden');
        });
    }

    startMonitoring(userId: string): void {
        if (this.isRunning) {
            console.log('⚠️ Monitoring already running');
            return;
        }

        console.log('🔔 Starting maintenance alert monitoring...');
        this.isRunning = true;

        // Vérification immédiate au démarrage
        this.checkAlerts();

        // Puis vérification périodique
        interval(this.CHECK_INTERVAL_MS)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.entretienService.getAllEntretiens())
            )
            .subscribe({
                next: (entretiens) => this.processAlerts(entretiens),
                error: (error) => console.error('❌ Error checking alerts:', error)
            });
    }

    stopMonitoring(): void {
        console.log('🔕 Stopping maintenance alert monitoring...');
        this.isRunning = false;
        this.destroy$.next();
    }

    checkAlerts(): void {
        this.entretienService.getAllEntretiens()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (entretiens) => this.processAlerts(entretiens),
                error: (error) => console.error('❌ Error checking alerts:', error)
            });
    }

    private processAlerts(entretiens: Entretien[]): void {
        const alertsWithEntretien = this.alertService.getEntretiensWithAlerts(entretiens);

        alertsWithEntretien.forEach(({ entretien, alert }) => {
            const shouldNotify =
                alert.type === EntretienAlertType.OVERDUE ||
                alert.type === EntretienAlertType.IMMINENT ||
                alert.type === EntretienAlertType.UPCOMING;

            if (shouldNotify && !this.lastNotifiedIds.has(entretien.id)) {
                this.sendNotification(entretien, alert);
                this.lastNotifiedIds.add(entretien.id);
            }
        });

        this.cleanupNotifiedIds(entretiens);
    }

    /**
     * Envoyer une notification
     * ✅ Son joué UNIQUEMENT si la page est visible
     */
    private sendNotification(entretien: Entretien, alert: any): void {
        const vehicule = entretien.vehicule?.matricule || 'Véhicule';
        const type = entretien.typeEntretien?.designation || 'Entretien';

        // ✅ Jouer le son UNIQUEMENT si la page est visible
        if (this.isPageVisible) {
            console.log('🔊 Page is visible, playing sound...');
            this.soundService.play();
        } else {
            console.log('🔇 Page is hidden, skipping sound');
        }

        // Notification navigateur (toujours affichée, même si page cachée)
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(`Rappel d'entretien`, {
                body: `${vehicule} - ${type}\n${alert.message}`,
                icon: '/assets/icons/maintenance-icon.png',
                badge: '/assets/icons/badge-icon.png',
                tag: `entretien-${entretien.id}`,
                requireInteraction: alert.type === EntretienAlertType.OVERDUE
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
                // ✅ Jouer le son quand l'utilisateur clique sur la notification
                this.soundService.play();
            };
        }

        console.log(`🔔 Alert sent for ${vehicule} - ${type}`);
    }

    private cleanupNotifiedIds(entretiens: Entretien[]): void {
        const currentIds = new Set(entretiens.map(e => e.id));
        this.lastNotifiedIds.forEach(id => {
            if (!currentIds.has(id)) {
                this.lastNotifiedIds.delete(id);
            }
        });
    }

    requestNotificationPermission(): void {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('📬 Notification permission:', permission);
            });
        }
    }

    ngOnDestroy(): void {
        this.stopMonitoring();
        this.destroy$.complete();
    }
}