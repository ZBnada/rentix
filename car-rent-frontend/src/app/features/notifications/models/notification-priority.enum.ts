// src/app/features/notifications/models/notification-priority.enum.ts
/**
 * Notification priority - MATCH BACKEND EXACTLY
 * Backend: BASSE, NORMALE, HAUTE, URGENTE, CRITIQUE
 */
export enum NotificationPriority {
  BASSE = 'BASSE',
  NORMALE = 'NORMALE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE',
  CRITIQUE = 'CRITIQUE',
}

export const NotificationPriorityLabels: Record<NotificationPriority, string> = {
  [NotificationPriority.BASSE]: 'Low',
  [NotificationPriority.NORMALE]: 'Normal',
  [NotificationPriority.HAUTE]: 'High',
  [NotificationPriority.URGENTE]: 'Urgent',
  [NotificationPriority.CRITIQUE]: 'Critical',
};

export const NotificationPriorityColors: Record<NotificationPriority, string> = {
  [NotificationPriority.BASSE]: 'gray',
  [NotificationPriority.NORMALE]: 'blue',
  [NotificationPriority.HAUTE]: 'orange',
  [NotificationPriority.URGENTE]: 'red',
  [NotificationPriority.CRITIQUE]: 'red',
};

export const NotificationPriorityBgColors: Record<NotificationPriority, string> = {
  [NotificationPriority.BASSE]: 'bg-gray-100',
  [NotificationPriority.NORMALE]: 'bg-blue-100',
  [NotificationPriority.HAUTE]: 'bg-orange-100',
  [NotificationPriority.URGENTE]: 'bg-red-100',
  [NotificationPriority.CRITIQUE]: 'bg-red-600',
};

export const NotificationPriorityTextColors: Record<NotificationPriority, string> = {
  [NotificationPriority.BASSE]: 'text-gray-600',
  [NotificationPriority.NORMALE]: 'text-blue-600',
  [NotificationPriority.HAUTE]: 'text-orange-600',
  [NotificationPriority.URGENTE]: 'text-red-600',
  [NotificationPriority.CRITIQUE]: 'text-white',
};