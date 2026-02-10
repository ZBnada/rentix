import { Injectable } from '@nestjs/common';
import { Notification } from '../entities/notification.entity';
import { NotificationResource } from '../dto/notification.resource';
import { CreateNotificationInput } from '../dto/create-notification.input';
import { VehiculeMapper } from '../../vehicule/mappers/vehicule.mapper';

/**
 * Mapper pour les notifications
 */
@Injectable()
export class NotificationMapper {
  constructor(private readonly vehiculeMapper: VehiculeMapper) {}

  /**
   * Convertir une entité en Resource
   */
  toResource(entity: Notification): NotificationResource | null {
    if (!entity) {
      return null;
    }

    const resource = new NotificationResource();
    resource.id = entity.id;
    resource.module = entity.module;
    resource.type = entity.type;
    // @ts-ignore
    resource.priorite = entity.priorite;
    resource.referenceId = entity.referenceId;
    resource.referenceType = entity.referenceType;
    resource.titre = entity.titre;
    resource.message = entity.message;
    resource.icone = entity.icone;
    resource.couleur = entity.couleur;
    resource.vehiculeId = entity.vehiculeId;
    resource.lue = entity.lue;
    resource.dateLecture = entity.dateLecture;
    resource.destinataire = entity.destinataire;
    resource.roleDestinataire = entity.roleDestinataire;

    // Sérialiser metadata en JSON string pour GraphQL
    resource.metadata = entity.metadata
      ? JSON.stringify(entity.metadata)
      : null;

    resource.actionUrl = entity.actionUrl;
    resource.actionLabel = entity.actionLabel;
    resource.creeLe = entity.creeLe;
    resource.modifieLe = entity.modifieLe;
    resource.expireLe = entity.expireLe;
    resource.estActive = entity.estActive;
    resource.estArchivee = entity.estArchivee;
    resource.creePar = entity.creePar;

    // Mapper le véhicule si présent
    if (entity.vehicule) {
      resource.vehicule = this.vehiculeMapper.toResource(entity.vehicule);
    }

    return resource;
  }

  /**
   * Convertir une liste d'entités en liste de Resources
   */
  toResourceList(entities: Notification[]): NotificationResource[] {
    // @ts-ignore
    return entities.map((entity) => this.toResource(entity)).filter(Boolean);
  }

  /**
   * Convertir un CreateInput en entité
   */
  createInputToEntity(input: CreateNotificationInput): Notification {
    const entity = new Notification();
    entity.module = input.module;
    entity.type = input.type;
    entity.priorite = input.priorite || 'NORMALE';
    entity.referenceId = input.referenceId;
    entity.referenceType = input.referenceType || null;
    entity.titre = input.titre;
    entity.message = input.message;
    entity.icone = input.icone || null;
    entity.couleur = input.couleur || null;
    entity.vehiculeId = input.vehiculeId || null;
    entity.destinataire = input.destinataire || null;
    entity.roleDestinataire = input.roleDestinataire || null;

    // Parser metadata JSON string
    if (input.metadata) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        entity.metadata = JSON.parse(input.metadata);
      } catch (e) {
        entity.metadata = null;
      }
    } else {
      entity.metadata = null;
    }

    entity.actionUrl = input.actionUrl || null;
    entity.actionLabel = input.actionLabel || null;
    entity.expireLe = input.expireLe || null;
    entity.creePar = input.creePar || null;
    entity.lue = false;
    entity.estActive = true;
    entity.estArchivee = false;

    return entity;
  }
}
