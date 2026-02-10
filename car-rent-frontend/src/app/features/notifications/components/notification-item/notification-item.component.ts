// src/app/shared/components/notifications/notification-item/notification-item.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '@features/notifications/models/notification.model';
import { NotificationPriority } from '@features/notifications/models/notification-priority.enum';
import { NotificationType } from '@features/notifications/models/notification-type.enum';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.css']
})
export class NotificationItemComponent {
  @Input() notification!: Notification;
  @Output() markAsRead = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  /**
   * Obtenir l'icône SVG selon le type de notification
   * */
  get iconPath(): string {
    switch (this.notification.type) {
      case 'RETARD':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'; // x-circle

      case 'IMMINENTE':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'; // alert-triangle

      case 'PROCHE':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'; // clock

      case 'INFO':
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'; // info

      case 'ALERTE':
        return 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'; // bell

      case 'URGENT':
        return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'; // alert-circle

      case 'EXPIRE':
        return 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'; // ban

      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'; // info par défaut
    }
  }

  /**
   * Couleur de l'icône selon la priorité
   */
  get iconColorClass(): string {
    switch (this.notification.priority) {
      case 'CRITIQUE':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';

      case 'URGENTE':
        return 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400';

      case 'HAUTE':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';

      case 'NORMALE':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';

      case 'BASSE':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';

      default:
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    }
  }

  /**
   * Texte de la priorité avec badge
   */
  get priorityBadge(): { show: boolean; text: string; classes: string } {
    const isHighPriority =
        this.notification.priority === 'HAUTE' ||
        this.notification.priority === 'URGENTE' ||
        this.notification.priority === 'CRITIQUE';

    if (!isHighPriority) {
      return { show: false, text: '', classes: '' };
    }

    let classes = '';
    switch (this.notification.priority) {
      case 'CRITIQUE':
        classes = 'bg-red-600 text-white';
        break;
      case 'URGENTE':
        classes = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        break;
      case 'HAUTE':
        classes = 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
        break;
    }

    return {
      show: true,
      text: this.notification.priority,
      classes
    };
  }

  /**
   * Icône du module
   */
  get moduleIcon(): string {
    switch (this.notification.module) {
      case 'ENTRETIEN':
        return 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z';

      case 'ASSURANCE':
        return 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';

      case 'VIGNETTE':
        return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';

      case 'CONTROLE_TECHNIQUE':
        return 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4';

      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  /**
   * Temps écoulé depuis la création
   */
  get timeAgo(): string {
    const now = new Date();
    const created = new Date(this.notification.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins === 1) return 'Il y a 1 minute';
    if (diffMins < 60) return `Il y a ${diffMins} minutes`;
    if (diffHours === 1) return 'Il y a 1 heure';
    if (diffHours < 24) return `Il y a ${diffHours} heures`;
    if (diffDays === 1) return 'Il y a 1 jour';
    return `Il y a ${diffDays} jours`;
  }

  /**
   * Gérer le clic sur "Marquer comme lu"
   */
  onMarkAsRead(event: Event): void {
    event.stopPropagation();
    this.markAsRead.emit(this.notification.id);
  }

  /**
   * Gérer le clic sur "Supprimer"
   */
  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.notification.id);
  }

  /**
   * Obtenir le chemin SVG de l'icône
   */
  getIcon(path: string): string {
    return path;
  }
}