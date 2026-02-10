// src/app/features/notifications/components/notification-panel/notification-panel.component.ts
// AVEC DESIGN MODERNE 🎨

import { Component, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Notification } from '@features/notifications/models/notification.model';
import { NotificationFacadeService } from '@features/notifications/services/notification-facade.service';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.css'],
})
export class NotificationPanelComponent implements OnInit {
  closePanel = output<void>();

  notifications$!: Observable<Notification[]>;
  unreadCount$!: Observable<number>;
  isLoading$!: Observable<boolean>;

  constructor(
      private notificationFacade: NotificationFacadeService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationFacade.getNotifications();
    this.unreadCount$ = this.notificationFacade.getUnreadCount();
    this.isLoading$ = this.notificationFacade.getLoadingState();

    // Load unread notifications
    this.notificationFacade.loadUnreadNotifications();
  }

  /**
   * Calculer le temps écoulé depuis la création
   */
  getTimeAgo(createdAt: Date): string {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Il y a 1 seconde';
    if (diffMins === 1) return 'Il y a 1 minute';
    if (diffMins < 60) return `Il y a ${diffMins} minutes`;
    if (diffHours === 1) return 'Il y a 1 heure';
    if (diffHours < 24) return `Il y a ${diffHours} heures`;
    if (diffDays === 1) return 'Il y a 1 jour';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? 'Il y a 1 semaine' : `Il y a ${weeks} semaines`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? 'Il y a 1 mois' : `Il y a ${months} mois`;
    }
    const years = Math.floor(diffDays / 365);
    return years === 1 ? 'Il y a 1 an' : `Il y a ${years} ans`;
  }

  /**
   * Marquer une notification comme lue
   */
  markAsRead(notificationId: string): void {
    this.notificationFacade.markAsRead(notificationId);
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  markAllAsRead(): void {
    this.notificationFacade.markAllAsRead();
  }

  /**
   * Supprimer une notification
   */
  deleteNotification(notificationId: string): void {
    this.notificationFacade.deleteNotification(notificationId);
  }

  /**
   * Voir toutes les notifications (page dédiée)
   */
  viewAllNotifications(): void {
    this.router.navigate(['/dashboard/notifications']);
    this.closePanel.emit();
  }

  /**
   * Gérer le click sur une notification
   */
  onNotificationClick(notification: Notification): void {
    // Marquer comme lue
    if (!notification.isRead) {
      this.markAsRead(notification.id);
    }

    // Naviguer vers l'URL d'action si disponible
    if (notification.actionUrl) {
      this.router.navigate([notification.actionUrl]);
      this.closePanel.emit();
    }
  }

  /**
   * Fermer le panel
   */
  handleClosePanel(): void {
    this.closePanel.emit();
  }
}