// src/app/features/notifications/models/notification-type.enum.ts
/**
 * Notification types - MATCH BACKEND EXACTLY
 * Backend: INFO, PROCHE, IMMINENTE, RETARD, EXPIRE, ALERTE, URGENT
 */
export enum NotificationType {
  INFO = 'INFO',
  PROCHE = 'PROCHE',
  IMMINENTE = 'IMMINENTE',
  RETARD = 'RETARD',
  EXPIRE = 'EXPIRE',
  ALERTE = 'ALERTE',
  URGENT = 'URGENT',
}

export const NotificationTypeLabels: Record<NotificationType, string> = {
  [NotificationType.INFO]: 'Information',
  [NotificationType.PROCHE]: 'Upcoming',
  [NotificationType.IMMINENTE]: 'Imminent',
  [NotificationType.RETARD]: 'Overdue',
  [NotificationType.EXPIRE]: 'Expired',
  [NotificationType.ALERTE]: 'Alert',
  [NotificationType.URGENT]: 'Urgent',
};

export const NotificationTypeIcons: Record<NotificationType, string> = {
  [NotificationType.INFO]: 'info-circle',
  [NotificationType.PROCHE]: 'clock',
  [NotificationType.IMMINENTE]: 'exclamation-triangle',
  [NotificationType.RETARD]: 'times-circle',
  [NotificationType.EXPIRE]: 'ban',
  [NotificationType.ALERTE]: 'bell',
  [NotificationType.URGENT]: 'exclamation-circle',
};

export const NotificationTypeColors: Record<NotificationType, string> = {
  [NotificationType.INFO]: 'blue',
  [NotificationType.PROCHE]: 'cyan',
  [NotificationType.IMMINENTE]: 'orange',
  [NotificationType.RETARD]: 'red',
  [NotificationType.EXPIRE]: 'gray',
  [NotificationType.ALERTE]: 'yellow',
  [NotificationType.URGENT]: 'red',
};