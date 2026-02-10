import { ModuleType } from './module-type.enum';
import { NotificationType } from './notification-type.enum';
import { NotificationPriority } from './notification-priority.enum';

/**
 * Main Notification model
 */
export interface Notification {
  id: string;
  module: ModuleType;
  type: NotificationType;
  priority: NotificationPriority;
  referenceId: string;
  referenceType?: string | null;
  title: string;
  message: string;
  icon?: string | null;
  color?: string | null;
  vehicleId?: string | null;
  vehicle?: {
    id: string;
    registrationNumber: string;
    brand?: {
      name: string;
    };
  } | null;
  isRead: boolean;
  readAt?: Date | null;
  recipient?: string | null;
  recipientRole?: string | null;
  metadata?: any | null;
  actionUrl?: string | null;
  actionLabel?: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date | null;
  isActive: boolean;
  isArchived: boolean;
  createdBy?: string | null;
}

/**
 * Notification statistics
 */
export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
  urgent: number;
  critical: number;
}

/**
 * Notification statistics by module
 */
export interface NotificationStatsByModule {
  module: ModuleType;
  count: number;
  unread: number;
}

/**
 * WebSocket notification event
 */
export interface NotificationEvent {
  notification: Notification;
  timestamp: Date;
}

/**
 * WebSocket count update event
 */
export interface NotificationCountEvent {
  count: number;
  timestamp: Date;
}

/**
 * Filter options for notifications
 */
export interface NotificationFilters {
  module?: ModuleType;
  type?: NotificationType;
  priority?: NotificationPriority;
  isRead?: boolean;
  vehicleId?: string;
  recipient?: string;
  limit?: number;
}
