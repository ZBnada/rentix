import { ObjectType, Field, ID } from '@nestjs/graphql';
import { VehiculeResource } from '../../vehicule/dto/vehicule.resource';
import { ModuleType } from '../enums/module-type.enum';
import { TypeNotification } from '../enums/type-notification.enum';
import { PrioriteNotification } from '../enums/priorite-notification.enum';

/**
 * Resource GraphQL pour les notifications
 */
@ObjectType('Notification')
export class NotificationResource {
  @Field(() => ID, { description: 'Identifiant unique de la notification' })
  id: string;

  @Field(() => ModuleType, { description: 'Module source de la notification' })
  module: ModuleType;

  @Field(() => TypeNotification, { description: 'Type de notification' })
  type: TypeNotification;

  @Field(() => PrioriteNotification, {
    description: 'Priorité de la notification',
  })
  priorite: PrioriteNotification | string;

  @Field(() => ID, { description: 'ID de la référence source' })
  referenceId: string;

  @Field(() => String, { description: 'Type de référence', nullable: true })
  referenceType?: string | null;

  @Field(() => String, { description: 'Titre de la notification' })
  titre: string;

  @Field(() => String, { description: 'Message détaillé' })
  message: string;

  @Field(() => String, { description: 'Icône', nullable: true })
  icone?: string | null;

  @Field(() => String, { description: 'Couleur', nullable: true })
  couleur?: string | null;

  @Field(() => ID, { description: 'ID du véhicule concerné', nullable: true })
  vehiculeId?: string | null;

  @Field(() => VehiculeResource, {
    description: 'Véhicule concerné',
    nullable: true,
  })
  vehicule?: VehiculeResource | null;

  @Field(() => Boolean, { description: 'Notification lue' })
  lue: boolean;

  @Field(() => Date, { description: 'Date de lecture', nullable: true })
  dateLecture?: Date | null;

  @Field(() => String, { description: 'Destinataire', nullable: true })
  destinataire?: string | null;

  @Field(() => String, { description: 'Rôle du destinataire', nullable: true })
  roleDestinataire?: string | null;

  @Field(() => String, {
    description: 'Metadata en JSON',
    nullable: true,
  })
  metadata?: string | null; // Sérialisé en JSON string pour GraphQL

  @Field(() => String, { description: "URL d'action", nullable: true })
  actionUrl?: string | null;

  @Field(() => String, { description: 'Label du bouton', nullable: true })
  actionLabel?: string | null;

  @Field(() => Date, { description: 'Date de création' })
  creeLe: Date;

  @Field(() => Date, { description: 'Date de modification' })
  modifieLe: Date;

  @Field(() => Date, { description: "Date d'expiration", nullable: true })
  expireLe?: Date | null;

  @Field(() => Boolean, { description: 'Est active' })
  estActive: boolean;

  @Field(() => Boolean, { description: 'Est archivée' })
  estArchivee: boolean;

  @Field(() => String, { description: 'Créée par', nullable: true })
  creePar?: string | null;
}
