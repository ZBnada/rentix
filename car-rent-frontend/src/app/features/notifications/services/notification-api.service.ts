// src/app/features/notifications/services/notification-api.service.ts
// VERSION PRODUCTION - SANS LOGS

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Notification } from '../models/notification.model';
import { NotificationService } from './notification.service';

/**
 * API Service Wrapper
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationApiService {
    private readonly notificationService = inject(NotificationService);

    /**
     * Récupérer les notifications non lues
     */
    getUnreadNotifications(): Observable<Notification[]> {
        return this.notificationService.getUnreadNotifications();
    }

    /**
     * Marquer comme lue
     */
    markAsRead(notificationId: string): Observable<boolean> {
        return this.notificationService.markAsRead(notificationId).pipe(
            map(() => true)
        );
    }

    /**
     * Marquer toutes comme lues
     */
    markAllAsRead(): Observable<number> {
        return this.notificationService.markAllAsRead();
    }

    /**
     * Supprimer une notification
     */
    deleteNotification(notificationId: string): Observable<boolean> {
        return this.notificationService.deleteNotification(notificationId);
    }

    /**
     * Compter les non lues
     */
    getUnreadCount(): Observable<number> {
        return this.notificationService.countUnreadNotifications();
    }
}