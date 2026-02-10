// src/app/features/entretien/services/entretien-alert.service.ts

import { Injectable } from '@angular/core';
import { Entretien } from '../models/entretien.model';

/**
 * Types d'alertes selon le temps restant
 */
export enum EntretienAlertType {
    NONE = 'NONE',           // > 30 jours - Pas d'alerte
    INFO = 'INFO',           // 8-30 jours - Bleu
    UPCOMING = 'UPCOMING',   // 2-7 jours - Orange
    IMMINENT = 'IMMINENT',   // 1 jour - Rouge clair
    OVERDUE = 'OVERDUE'      // Passé - Rouge foncé
}

/**
 * Interface pour les informations d'alerte
 */
export interface EntretienAlert {
    type: EntretienAlertType;
    daysRemaining: number;
    message: string;
    color: string;
    bgColor: string;
    icon: string;
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'critical';
}

/**
 * Service pour calculer les alertes d'entretien
 */
@Injectable({
    providedIn: 'root'
})
export class EntretienAlertService {

    /**
     * Calculer l'alerte pour un entretien
     */
    calculateAlert(entretien: Entretien): EntretienAlert {
        if (!entretien.dateLimiteProchainEntretien) {
            return this.getNoAlert();
        }

        const daysRemaining = this.calculateDaysRemaining(entretien.dateLimiteProchainEntretien);
        const alertType = this.getAlertType(daysRemaining);

        return {
            type: alertType,
            daysRemaining,
            message: this.getMessage(alertType, daysRemaining, entretien),
            color: this.getColor(alertType),
            bgColor: this.getBgColor(alertType),
            icon: this.getIcon(alertType),
            priority: this.getPriority(alertType)
        };
    }

    /**
     * Calculer le nombre de jours restants
     */
    private calculateDaysRemaining(dateLimite: string): number {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const limitDate = new Date(dateLimite);
        limitDate.setHours(0, 0, 0, 0);

        const diffTime = limitDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    }

    /**
     * Déterminer le type d'alerte selon les jours restants
     */
    private getAlertType(daysRemaining: number): EntretienAlertType {
        if (daysRemaining < 0) {
            return EntretienAlertType.OVERDUE;
        } else if (daysRemaining === 0 || daysRemaining === 1) {
            return EntretienAlertType.IMMINENT;
        } else if (daysRemaining >= 2 && daysRemaining <= 7) {
            return EntretienAlertType.UPCOMING;
        } else if (daysRemaining >= 8 && daysRemaining <= 30) {
            return EntretienAlertType.INFO;
        } else {
            return EntretienAlertType.NONE;
        }
    }

    /**
     * Générer le message d'alerte
     */
    private getMessage(alertType: EntretienAlertType, daysRemaining: number, entretien: Entretien): string {
        const designation = entretien.typeEntretien?.designation || 'Entretien';

        switch (alertType) {
            case EntretienAlertType.OVERDUE:
                const daysOverdue = Math.abs(daysRemaining);
                return `⚠️ ${designation} en retard de ${daysOverdue} jour${daysOverdue > 1 ? 's' : ''}`;

            case EntretienAlertType.IMMINENT:
                return daysRemaining === 0
                    ? `🔴 ${designation} prévu aujourd'hui !`
                    : `🔴 ${designation} prévu demain !`;

            case EntretienAlertType.UPCOMING:
                return `🟠 ${designation} dans ${daysRemaining} jours`;

            case EntretienAlertType.INFO:
                return `🔵 ${designation} prévu dans ${daysRemaining} jours`;

            default:
                return `✅ ${designation} programmé`;
        }
    }

    /**
     * Couleur du texte
     */
    private getColor(alertType: EntretienAlertType): string {
        switch (alertType) {
            case EntretienAlertType.OVERDUE:
                return 'text-red-700 dark:text-red-400';
            case EntretienAlertType.IMMINENT:
                return 'text-red-600 dark:text-red-400';
            case EntretienAlertType.UPCOMING:
                return 'text-orange-600 dark:text-orange-400';
            case EntretienAlertType.INFO:
                return 'text-blue-600 dark:text-blue-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    }

    /**
     * Couleur de fond
     */
    private getBgColor(alertType: EntretienAlertType): string {
        switch (alertType) {
            case EntretienAlertType.OVERDUE:
                return 'bg-red-100 dark:bg-red-900/30';
            case EntretienAlertType.IMMINENT:
                return 'bg-red-50 dark:bg-red-900/20';
            case EntretienAlertType.UPCOMING:
                return 'bg-orange-50 dark:bg-orange-900/20';
            case EntretienAlertType.INFO:
                return 'bg-blue-50 dark:bg-blue-900/20';
            default:
                return 'bg-gray-50 dark:bg-gray-900/20';
        }
    }

    /**
     * Icône
     */
    private getIcon(alertType: EntretienAlertType): string {
        switch (alertType) {
            case EntretienAlertType.OVERDUE:
                return 'x-circle';
            case EntretienAlertType.IMMINENT:
                return 'alert-circle';
            case EntretienAlertType.UPCOMING:
                return 'clock';
            case EntretienAlertType.INFO:
                return 'info';
            default:
                return 'check-circle';
        }
    }

    /**
     * Priorité
     */
    private getPriority(alertType: EntretienAlertType): 'low' | 'normal' | 'high' | 'urgent' | 'critical' {
        switch (alertType) {
            case EntretienAlertType.OVERDUE:
                return 'critical';
            case EntretienAlertType.IMMINENT:
                return 'urgent';
            case EntretienAlertType.UPCOMING:
                return 'high';
            case EntretienAlertType.INFO:
                return 'normal';
            default:
                return 'low';
        }
    }

    /**
     * Retourner une alerte vide
     */
    private getNoAlert(): EntretienAlert {
        return {
            type: EntretienAlertType.NONE,
            daysRemaining: 9999,
            message: 'Aucune alerte',
            color: 'text-gray-600 dark:text-gray-400',
            bgColor: 'bg-gray-50 dark:bg-gray-900/20',
            icon: 'check-circle',
            priority: 'low'
        };
    }

    /**
     * Filtrer les entretiens qui nécessitent une alerte
     */
    getEntretiensWithAlerts(entretiens: Entretien[]): Array<{ entretien: Entretien; alert: EntretienAlert }> {
        return entretiens
            .map(entretien => ({
                entretien,
                alert: this.calculateAlert(entretien)
            }))
            .filter(item => item.alert.type !== EntretienAlertType.NONE)
            .sort((a, b) => {
                // Trier par priorité (plus critique en premier)
                const priorityOrder = { critical: 0, urgent: 1, high: 2, normal: 3, low: 4 };
                return priorityOrder[a.alert.priority] - priorityOrder[b.alert.priority];
            });
    }

    /**
     * Compter les alertes par type
     */
    countAlertsByType(entretiens: Entretien[]): Record<EntretienAlertType, number> {
        const counts: Record<EntretienAlertType, number> = {
            [EntretienAlertType.NONE]: 0,
            [EntretienAlertType.INFO]: 0,
            [EntretienAlertType.UPCOMING]: 0,
            [EntretienAlertType.IMMINENT]: 0,
            [EntretienAlertType.OVERDUE]: 0,
        };

        entretiens.forEach(entretien => {
            const alert = this.calculateAlert(entretien);
            counts[alert.type]++;
        });

        return counts;
    }
}