import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { NotificationResource } from './dto/notification.resource';
import { CreateNotificationInput } from './dto/create-notification.input';
import {
  NotificationStatistiques,
  NotificationStatistiquesParModule,
} from './dto/notification-statistiques.dto';
import { ModuleType } from './enums/module-type.enum';
import { PrioriteNotification } from './enums/priorite-notification.enum';

/**
 * Resolver GraphQL pour les notifications
 */
@Resolver(() => NotificationResource)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  // ========================================
  // MUTATIONS
  // ========================================

  /**
   * Créer une notification
   */
  @Mutation(() => NotificationResource, {
    name: 'creerNotification',
    description: 'Créer une nouvelle notification',
  })
  async creerNotification(
    @Args('input', { type: () => CreateNotificationInput })
    input: CreateNotificationInput,
  ): Promise<NotificationResource> {
    return this.notificationService.creerNotification(input);
  }

  /**
   * Marquer une notification comme lue
   */
  @Mutation(() => NotificationResource, {
    name: 'marquerNotificationCommeLue',
    description: 'Marquer une notification comme lue',
  })
  async marquerCommeLue(
    @Args('id', { type: () => String }) id: string,
  ): Promise<NotificationResource> {
    return this.notificationService.marquerCommeLue(id);
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  @Mutation(() => Int, {
    name: 'marquerToutesNotificationsCommeLues',
    description: 'Marquer toutes les notifications comme lues',
  })
  async marquerToutesCommeLues(
    @Args('destinataire', { type: () => String, nullable: true })
    destinataire?: string,
  ): Promise<number> {
    return this.notificationService.marquerToutesCommeLues(destinataire);
  }

  /**
   * Archiver une notification
   */
  @Mutation(() => Boolean, {
    name: 'archiverNotification',
    description: 'Archiver une notification',
  })
  async archiverNotification(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.notificationService.archiverNotification(id);
  }

  /**
   * Supprimer une notification
   */
  @Mutation(() => Boolean, {
    name: 'supprimerNotification',
    description: 'Supprimer une notification (soft delete)',
  })
  async supprimerNotification(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.notificationService.supprimerNotification(id);
  }

  // ========================================
  // QUERIES
  // ========================================

  /**
   * Récupérer toutes les notifications non lues
   */
  @Query(() => [NotificationResource], {
    name: 'notificationsNonLues',
    description: 'Récupérer toutes les notifications non lues',
  })
  async getNotificationsNonLues(
    @Args('destinataire', { type: () => String, nullable: true })
    destinataire?: string,
  ): Promise<NotificationResource[]> {
    return this.notificationService.getNotificationsNonLues(destinataire);
  }

  /**
   * Récupérer toutes les notifications
   */
  @Query(() => [NotificationResource], {
    name: 'notifications',
    description: 'Récupérer toutes les notifications',
  })
  async getAllNotifications(
    @Args('destinataire', { type: () => String, nullable: true })
    destinataire?: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit?: number,
  ): Promise<NotificationResource[]> {
    return this.notificationService.getAllNotifications(destinataire, limit);
  }

  /**
   * Récupérer une notification par ID
   */
  @Query(() => NotificationResource, {
    name: 'notification',
    description: 'Récupérer une notification par son ID',
    nullable: true,
  })
  async getNotificationById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<NotificationResource> {
    return this.notificationService.getNotificationById(id);
  }

  /**
   * Compter les notifications non lues
   */
  @Query(() => Int, {
    name: 'countNotificationsNonLues',
    description: 'Compter les notifications non lues',
  })
  async countNonLues(
    @Args('destinataire', { type: () => String, nullable: true })
    destinataire?: string,
  ): Promise<number> {
    return this.notificationService.countNonLues(destinataire);
  }

  /**
   * Récupérer notifications par module
   */
  @Query(() => [NotificationResource], {
    name: 'notificationsByModule',
    description: 'Récupérer les notifications par module',
  })
  async getNotificationsByModule(
    @Args('module', { type: () => ModuleType }) module: ModuleType,
    @Args('destinataire', { type: () => String, nullable: true })
    destinataire?: string,
  ): Promise<NotificationResource[]> {
    return this.notificationService.getNotificationsByModule(
      module,
      destinataire,
    );
  }

  /**
   * Récupérer notifications par véhicule
   */
  @Query(() => [NotificationResource], {
    name: 'notificationsByVehicule',
    description: 'Récupérer les notifications par véhicule',
  })
  async getNotificationsByVehicule(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
  ): Promise<NotificationResource[]> {
    return this.notificationService.getNotificationsByVehicule(vehiculeId);
  }

  /**
   * Récupérer notifications par priorité
   */
  @Query(() => [NotificationResource], {
    name: 'notificationsByPriorite',
    description: 'Récupérer les notifications par priorité',
  })
  async getNotificationsByPriorite(
    @Args('priorite', { type: () => PrioriteNotification })
    priorite: PrioriteNotification,
    @Args('destinataire', { type: () => String, nullable: true })
    destinataire?: string,
  ): Promise<NotificationResource[]> {
    return this.notificationService.getNotificationsByPriorite(
      priorite,
      destinataire,
    );
  }

  /**
   * Obtenir les statistiques des notifications
   */
  @Query(() => NotificationStatistiques, {
    name: 'notificationsStatistiques',
    description: 'Obtenir les statistiques des notifications',
  })
  async getStatistiques(
    @Args('destinataire', { type: () => String, nullable: true })
    destinataire?: string,
  ): Promise<NotificationStatistiques> {
    return this.notificationService.getStatistiques(destinataire);
  }

  /**
   * Obtenir statistiques par module
   */
  @Query(() => [NotificationStatistiquesParModule], {
    name: 'notificationsStatistiquesParModule',
    description: 'Obtenir les statistiques par module',
  })
  async getStatistiquesParModule(
    @Args('destinataire', { type: () => String, nullable: true })
    destinataire?: string,
  ): Promise<NotificationStatistiquesParModule[]> {
    return this.notificationService.getStatistiquesParModule(destinataire);
  }
}
