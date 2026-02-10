import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
// @ts-ignore
import { Socket, io } from 'socket.io-client';
import { Notification, NotificationEvent, NotificationCountEvent } from '../models/notification.model';

/**
 * WebSocket service for real-time notifications
 * Handles Socket.IO connection to backend
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationWebsocketService {
  // @ts-ignore
  private socket: Socket | null = null;
  private readonly SOCKET_URL = 'http://localhost:3000/notifications';

  // Observables
  private connectionStatus$ = new BehaviorSubject<boolean>(false);
  private newNotification$ = new Subject<Notification>();
  private notificationRead$ = new Subject<string>();
  private allNotificationsRead$ = new Subject<void>();
  private notificationCount$ = new Subject<number>();

  /**
   * Get connection status
   */
  get isConnected$(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  /**
   * Get new notification stream
   */
  get onNewNotification$(): Observable<Notification> {
    return this.newNotification$.asObservable();
  }

  /**
   * Get notification read event stream
   */
  get onNotificationRead$(): Observable<string> {
    return this.notificationRead$.asObservable();
  }

  /**
   * Get all notifications read event stream
   */
  get onAllNotificationsRead$(): Observable<void> {
    return this.allNotificationsRead$.asObservable();
  }

  /**
   * Get notification count update stream
   */
  get onNotificationCount$(): Observable<number> {
    return this.notificationCount$.asObservable();
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    this.socket = io(this.SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus$.next(false);
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Subscribe to notifications for a specific user
   */
  subscribeToUser(userId: string): void {
    if (!this.socket?.connected) {
      console.error('WebSocket not connected. Call connect() first.');
      return;
    }

    this.socket.emit('subscribe-user', { userId });
    console.log(`Subscribed to notifications for user: ${userId}`);
  }

  /**
   * Unsubscribe from user notifications
   */
  unsubscribeFromUser(userId: string): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('unsubscribe-user', { userId });
    console.log(`Unsubscribed from notifications for user: ${userId}`);
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket?.id);
      this.connectionStatus$.next(true);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.connectionStatus$.next(false);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('WebSocket connection error:', error);
      this.connectionStatus$.next(false);
    });

    // Connection success
    this.socket.on('connection-success', (data: unknown) => {
      console.log('Connection success:', data);
    });

    // Subscription events
    this.socket.on('subscription-success', (data: unknown) => {
      console.log('Subscription success:', data);
    });

    this.socket.on('unsubscription-success', (data: unknown) => {
      console.log('Unsubscription success:', data);
    });

    // Notification events
    this.socket.on('nouvelle-notification', (event: NotificationEvent) => {
      console.log('📩 New notification received:', event.notification);
      this.newNotification$.next(event.notification);
    });

    this.socket.on('notifications-count', (event: NotificationCountEvent) => {
      console.log('🔢 Notification count updated:', event.count);
      this.notificationCount$.next(event.count);
    });

    this.socket.on('notification-lue', (data: { notificationId: string }) => {
      console.log('✓ Notification marked as read:', data.notificationId);
      this.notificationRead$.next(data.notificationId);
    });

    this.socket.on('toutes-notifications-lues', () => {
      console.log('✓ All notifications marked as read');
      this.allNotificationsRead$.next();
    });

    // Error events
    this.socket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}