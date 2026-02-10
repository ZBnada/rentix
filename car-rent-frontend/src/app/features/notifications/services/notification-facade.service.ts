// src/app/features/notifications/services/notification-facade.service.ts
// VERSION PRODUCTION - AVEC SON

import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import type { Notification } from '../models/notification.model';
import { NotificationWebsocketService } from './notification-websocket.service';
import { NotificationApiService } from './notification-api.service';
import { NotificationSoundService } from './notification-sound.service';

/**
 * Main Notification Facade Service
 */
@Injectable({
    providedIn: 'root',
})
export class NotificationFacadeService implements OnDestroy {
    private readonly wsService = inject(NotificationWebsocketService);
    private readonly apiService = inject(NotificationApiService);
    private readonly soundService = inject(NotificationSoundService);

    private destroy$ = new Subject<void>();

    // State
    private notifications$ = new BehaviorSubject<Notification[]>([]);
    private unreadCount$ = new BehaviorSubject<number>(0);
    private isLoading$ = new BehaviorSubject<boolean>(false);
    private currentUserId: string | null = null;

    constructor() {
        this.setupWebSocketListeners();
    }

    /**
     * Initialize notification system for a user
     */
    initialize(userId: string): void {
        this.currentUserId = userId;
        this.wsService.connect();
        this.wsService.subscribeToUser(userId);
        this.loadUnreadNotifications();
        this.loadUnreadCount();
    }

    /**
     * Cleanup
     */
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.wsService.disconnect();
    }

    /**
     * Get notifications observable
     */
    getNotifications(): Observable<Notification[]> {
        return this.notifications$.asObservable();
    }

    /**
     * Get unread count observable
     */
    getUnreadCount(): Observable<number> {
        return this.unreadCount$.asObservable();
    }

    /**
     * Get loading state observable
     */
    getLoadingState(): Observable<boolean> {
        return this.isLoading$.asObservable();
    }

    /**
     * Get WebSocket connection status
     */
    getConnectionStatus(): Observable<boolean> {
        return this.wsService.isConnected$;
    }

    /**
     * Get sound enabled status
     */
    isSoundEnabled(): boolean {
        return this.soundService.isSoundEnabled();
    }

    /**
     * Toggle notification sound
     */
    toggleNotificationSound(enabled: boolean): void {
        this.soundService.toggleSound(enabled);
    }

    /**
     * Load unread notifications
     */
    loadUnreadNotifications(): void {
        this.isLoading$.next(true);

        this.apiService.getUnreadNotifications()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (notifications) => {
                    this.notifications$.next(notifications);
                    this.isLoading$.next(false);

                    const unreadCount = notifications.filter(n => !n.isRead).length;
                    this.unreadCount$.next(unreadCount);
                },
                error: (err) => {
                    console.error('Error loading notifications:', err);
                    this.isLoading$.next(false);
                },
            });
    }

    /**
     * Load unread count
     */
    private loadUnreadCount(): void {
        this.apiService.getUnreadCount()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (count) => this.unreadCount$.next(count),
                error: (err) => console.error('Error loading unread count:', err),
            });
    }

    /**
     * Mark notification as read
     */
    markAsRead(notificationId: string): void {
        this.apiService.markAsRead(notificationId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    const notifications = this.notifications$.value.map((n) =>
                        n.id === notificationId
                            ? { ...n, isRead: true, readAt: new Date() }
                            : n
                    );
                    this.notifications$.next(notifications);
                    this.loadUnreadCount();
                },
                error: (err) => console.error('Error marking as read:', err),
            });
    }

    /**
     * Mark all as read
     */
    markAllAsRead(): void {
        this.apiService.markAllAsRead()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    const notifications = this.notifications$.value.map((n) => ({
                        ...n,
                        isRead: true,
                        readAt: new Date(),
                    }));
                    this.notifications$.next(notifications);
                    this.unreadCount$.next(0);
                },
                error: (err) => console.error('Error marking all as read:', err),
            });
    }

    /**
     * Delete notification
     */
    deleteNotification(notificationId: string): void {
        this.apiService.deleteNotification(notificationId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    const notifications = this.notifications$.value.filter(
                        (n) => n.id !== notificationId
                    );
                    this.notifications$.next(notifications);
                    this.loadUnreadCount();
                },
                error: (err) => console.error('Error deleting notification:', err),
            });
    }

    /**
     * Refresh notifications
     */
    refresh(): void {
        this.loadUnreadNotifications();
        this.loadUnreadCount();
    }

    /**
     * Setup WebSocket listeners
     */
    private setupWebSocketListeners(): void {
        // Listen for new notifications
        this.wsService.onNewNotification$
            .pipe(takeUntil(this.destroy$))
            .subscribe((notification) => {
                const notifications = [notification, ...this.notifications$.value];
                this.notifications$.next(notifications);

                if (!notification.isRead) {
                    this.unreadCount$.next(this.unreadCount$.value + 1);
                }

                // Play sound for new notification
                this.soundService.play();

                // Show browser notification
                this.showBrowserNotification(notification);
            });

        // Listen for count updates
        this.wsService.onNotificationCount$
            .pipe(takeUntil(this.destroy$))
            .subscribe((count) => {
                this.unreadCount$.next(count);
            });

        // Listen for read events
        this.wsService.onNotificationRead$
            .pipe(takeUntil(this.destroy$))
            .subscribe((notificationId) => {
                const notifications = this.notifications$.value.map((n) =>
                    n.id === notificationId
                        ? { ...n, isRead: true, readAt: new Date() }
                        : n
                );
                this.notifications$.next(notifications);
            });

        // Listen for all read events
        this.wsService.onAllNotificationsRead$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const notifications = this.notifications$.value.map((n) => ({
                    ...n,
                    isRead: true,
                    readAt: new Date(),
                }));
                this.notifications$.next(notifications);
                this.unreadCount$.next(0);
            });
    }

    /**
     * Show browser notification
     */
    private showBrowserNotification(notification: Notification): void {
        if (!('Notification' in window)) {
            return;
        }

        if (Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/assets/icons/notification-icon.png',
                badge: '/assets/icons/badge-icon.png',
                tag: notification.id,
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    new Notification(notification.title, {
                        body: notification.message,
                    });
                }
            });
        }
    }
}