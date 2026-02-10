import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ModuleType } from '../enums/module-type.enum';
import { TypeNotification } from '../enums/type-notification.enum';

/**
 * Statistiques des notifications
 */
@ObjectType('NotificationStatistiques')
export class NotificationStatistiques {
  @Field(() => Int, { description: 'Total de notifications' })
  total: number;

  @Field(() => Int, { description: 'Notifications non lues' })
  nonLues: number;

  @Field(() => Int, { description: 'Notifications lues' })
  lues: number;

  @Field(() => Int, { description: 'Notifications archivées' })
  archivees: number;

  @Field(() => Int, { description: 'Notifications urgentes' })
  urgentes: number;

  @Field(() => Int, { description: 'Notifications critiques' })
  critiques: number;
}

/**
 * Statistiques par module
 */
@ObjectType('NotificationStatistiquesParModule')
export class NotificationStatistiquesParModule {
  @Field(() => ModuleType, { description: 'Module' })
  module: ModuleType;

  @Field(() => Int, { description: 'Nombre de notifications' })
  count: number;

  @Field(() => Int, { description: 'Non lues' })
  nonLues: number;
}

/**
 * Statistiques par type
 */
@ObjectType('NotificationStatistiquesParType')
export class NotificationStatistiquesParType {
  @Field(() => TypeNotification, { description: 'Type' })
  type: TypeNotification;

  @Field(() => Int, { description: 'Nombre de notifications' })
  count: number;
}
