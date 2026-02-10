import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, In, Not } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Notification } from '../notification/entities/notification.entity';
import { CreateNotificationInput } from '../notification/dto/create-notification.input';
import { NotificationResource } from '../notification/dto/notification.resource';
import { NotificationMapper } from '../notification/mappers/notification.mapper';
import { NotificationGateway } from '../notification/gateway/notification.gateway';
import { ModuleType } from '../notification/enums/module-type.enum';
import { PrioriteNotification } from '../notification/enums/priorite-notification.enum';
import {
  NotificationStatistiques,
  NotificationStatistiquesParModule,
} from '../notification/dto/notification-statistiques.dto';

/**
 * Service de gestion centralisée des notifications
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly notificationMapper: NotificationMapper,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  /**
   * Créer une notification et l'envoyer en temps réel via WebSocket
   */
  async creerNotification(
    input: CreateNotificationInput,
  ): Promise<NotificationResource> {
    // Créer l'entité
    const entity = this.notificationMapper.createInputToEntity(input);

    // Sauvegarder
    const saved = await this.notificationRepository.save(entity);

    // Récupérer avec relations
    const notificationWithRelations = await this.notificationRepository.findOne(
      {
        where: { id: saved.id },
        relations: ['vehicule', 'vehicule.marque'],
      },
    );

    if (!notificationWithRelations) {
      throw new Error('Erreur lors de la récupération de la notification');
    }

    const resource = this.notificationMapper.toResource(
      notificationWithRelations,
    );
    if (!resource) {
      throw new Error('Erreur lors de la conversion en resource');
    }

    // ✅ Émettre en temps réel via WebSocket
    if (input.destinataire) {
      this.notificationGateway.emitNotificationToUser(
        input.destinataire,
        resource,
      );
    } else {
      this.notificationGateway.emitNewNotification(resource);
    }

    // ✅ Émettre le nouveau count
    const count = await this.countNonLues(input.destinataire);
    this.notificationGateway.emitNotificationsCount(count, input.destinataire);

    this.logger.log(
      `Notification créée et émise: ${resource.id} - ${resource.titre}`,
    );

    return resource;
  }

  /**
   * Récupérer toutes les notifications non lues
   */
  async getNotificationsNonLues(
    destinataire?: string,
  ): Promise<NotificationResource[]> {
    const where: any = { lue: false, estActive: true, estArchivee: false };

    if (destinataire) {
      where.destinataire = destinataire;
    }

    const notifications = await this.notificationRepository.find({
      where,
      relations: ['vehicule', 'vehicule.marque'],
      order: { creeLe: 'DESC' },
    });

    return this.notificationMapper.toResourceList(notifications);
  }

  /**
   * Récupérer toutes les notifications (lues et non lues)
   */
  async getAllNotifications(
    destinataire?: string,
    limit: number = 50,
  ): Promise<NotificationResource[]> {
    const where: any = { estActive: true, estArchivee: false };

    if (destinataire) {
      where.destinataire = destinataire;
    }

    const notifications = await this.notificationRepository.find({
      where,
      relations: ['vehicule', 'vehicule.marque'],
      order: { creeLe: 'DESC' },
      take: limit,
    });

    return this.notificationMapper.toResourceList(notifications);
  }

  /**
   * Compter les notifications non lues
   */
  async countNonLues(
    destinataire?: string | null | undefined,
  ): Promise<number> {
    const where: any = { lue: false, estActive: true, estArchivee: false };

    if (destinataire) {
      where.destinataire = destinataire;
    }

    return this.notificationRepository.count({ where });
  }

  /**
   * Récupérer une notification par ID
   */
  async getNotificationById(id: string): Promise<NotificationResource> {
    const notification = await this.notificationRepository.findOne({
      where: { id, estActive: true },
      relations: ['vehicule', 'vehicule.marque'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID "${id}" introuvable`);
    }

    const resource = this.notificationMapper.toResource(notification);
    if (!resource) {
      throw new Error('Erreur lors de la conversion en resource');
    }
    return resource;
  }

  /**
   * Marquer une notification comme lue
   */
  async marquerCommeLue(id: string): Promise<NotificationResource> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['vehicule', 'vehicule.marque'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID "${id}" introuvable`);
    }

    notification.lue = true;
    notification.dateLecture = new Date();

    await this.notificationRepository.save(notification);

    // ✅ Émettre l'événement de lecture
    this.notificationGateway.emitNotificationRead(
      id,
      notification.destinataire,
    );

    // ✅ Émettre le nouveau count
    const count = await this.countNonLues(notification.destinataire);
    this.notificationGateway.emitNotificationsCount(
      count,
      notification.destinataire,
    );

    const resource = this.notificationMapper.toResource(notification);
    if (!resource) {
      throw new Error('Erreur lors de la conversion en resource');
    }
    return resource;
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async marquerToutesCommeLues(destinataire?: string): Promise<number> {
    const where: any = { lue: false, estActive: true };

    if (destinataire) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.destinataire = destinataire;
    }

    const result = await this.notificationRepository.update(where, {
      lue: true,
      dateLecture: new Date(),
    });

    // ✅ Émettre l'événement
    this.notificationGateway.emitAllNotificationsRead(destinataire);

    // ✅ Émettre count = 0
    this.notificationGateway.emitNotificationsCount(0, destinataire);

    return result.affected || 0;
  }

  /**
   * Récupérer notifications par module
   */
  async getNotificationsByModule(
    module: ModuleType,
    destinataire?: string,
  ): Promise<NotificationResource[]> {
    const where: any = { module, estActive: true, estArchivee: false };

    if (destinataire) {
      where.destinataire = destinataire;
    }

    const notifications = await this.notificationRepository.find({
      where,
      relations: ['vehicule', 'vehicule.marque'],
      order: { creeLe: 'DESC' },
    });

    return this.notificationMapper.toResourceList(notifications);
  }

  /**
   * Récupérer notifications par véhicule
   */
  async getNotificationsByVehicule(
    vehiculeId: string,
  ): Promise<NotificationResource[]> {
    const notifications = await this.notificationRepository.find({
      where: { vehiculeId, estActive: true, estArchivee: false },
      relations: ['vehicule', 'vehicule.marque'],
      order: { creeLe: 'DESC' },
    });

    return this.notificationMapper.toResourceList(notifications);
  }

  /**
   * Récupérer notifications par priorité
   */
  async getNotificationsByPriorite(
    priorite: PrioriteNotification,
    destinataire?: string,
  ): Promise<NotificationResource[]> {
    const where: any = { priorite, estActive: true, estArchivee: false };

    if (destinataire) {
      where.destinataire = destinataire;
    }

    const notifications = await this.notificationRepository.find({
      where,
      relations: ['vehicule', 'vehicule.marque'],
      order: { creeLe: 'DESC' },
    });

    return this.notificationMapper.toResourceList(notifications);
  }

  /**
   * Archiver une notification
   */
  async archiverNotification(id: string): Promise<boolean> {
    const result = await this.notificationRepository.update(id, {
      estArchivee: true,
    });

    return (result.affected || 0) > 0;
  }

  /**
   * Supprimer une notification (soft delete)
   */
  async supprimerNotification(id: string): Promise<boolean> {
    const result = await this.notificationRepository.update(id, {
      estActive: false,
    });

    return (result.affected || 0) > 0;
  }

  /**
   * Obtenir les statistiques des notifications
   */
  async getStatistiques(
    destinataire?: string,
  ): Promise<NotificationStatistiques> {
    const where: any = { estActive: true };

    if (destinataire) {
      where.destinataire = destinataire;
    }

    const [total, nonLues, archivees, urgentes, critiques] = await Promise.all([
      this.notificationRepository.count({ where }),
      this.notificationRepository.count({ where: { ...where, lue: false } }),
      this.notificationRepository.count({
        where: { ...where, estArchivee: true },
      }),
      this.notificationRepository.count({
        where: { ...where, priorite: PrioriteNotification.URGENTE },
      }),
      this.notificationRepository.count({
        where: { ...where, priorite: PrioriteNotification.CRITIQUE },
      }),
    ]);

    return {
      total,
      nonLues,
      lues: total - nonLues,
      archivees,
      urgentes,
      critiques,
    };
  }

  /**
   * Obtenir statistiques par module
   */
  async getStatistiquesParModule(
    destinataire?: string,
  ): Promise<NotificationStatistiquesParModule[]> {
    const where: any = { estActive: true };

    if (destinataire) {
      where.destinataire = destinataire;
    }

    const results = await this.notificationRepository
      .createQueryBuilder('notification')
      .select('notification.module', 'module')
      .addSelect('COUNT(notification.id)', 'count')
      .addSelect(
        'SUM(CASE WHEN notification.lue = false THEN 1 ELSE 0 END)',
        'nonLues',
      )
      .where(where)
      .groupBy('notification.module')
      .getRawMany();

    return results.map((r) => ({
      module: r.module as ModuleType,
      count: parseInt(r.count),
      nonLues: parseInt(r.nonLues),
    }));
  }

  /**
   * CRON: Nettoyage automatique des anciennes notifications (30 jours)
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async nettoyerAnciennesNotifications(): Promise<void> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 30);

    const result = await this.notificationRepository.delete({
      creeLe: LessThanOrEqual(dateLimit),
      lue: true,
      estArchivee: true,
    });

    this.logger.log(
      `Nettoyage notifications: ${result.affected || 0} notifications supprimées`,
    );
  }

  /**
   * CRON: Archiver automatiquement les notifications lues après 7 jours
   */
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async archiverNotificationsLues(): Promise<void> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 7);

    const result = await this.notificationRepository.update(
      {
        lue: true,
        dateLecture: LessThanOrEqual(dateLimit),
        estArchivee: false,
      },
      {
        estArchivee: true,
      },
    );

    this.logger.log(
      `Archivage automatique: ${result.affected || 0} notifications archivées`,
    );
  }
}
