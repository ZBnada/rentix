import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { ModuleType } from '../enums/module-type.enum';
import { TypeNotification } from '../enums/type-notification.enum';
import { PrioriteNotification } from '../enums/priorite-notification.enum';

/**
 * Input pour créer une notification
 */
@InputType('CreateNotificationInput')
export class CreateNotificationInput {
  @Field(() => ModuleType, { description: 'Module source' })
  @IsNotEmpty({ message: 'Le module est requis' })
  @IsEnum(ModuleType)
  module: ModuleType;

  @Field(() => TypeNotification, { description: 'Type de notification' })
  @IsNotEmpty({ message: 'Le type est requis' })
  @IsEnum(TypeNotification)
  type: TypeNotification;

  @Field(() => PrioriteNotification, {
    description: 'Priorité',
    defaultValue: PrioriteNotification.NORMALE,
  })
  @IsOptional()
  @IsEnum(PrioriteNotification)
  priorite?: PrioriteNotification;

  @Field(() => ID, { description: 'ID de la référence source' })
  @IsNotEmpty({ message: 'La référence est requise' })
  @IsUUID('4')
  referenceId: string;

  @Field(() => String, { description: 'Type de référence', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceType?: string | null;

  @Field(() => String, { description: 'Titre' })
  @IsNotEmpty({ message: 'Le titre est requis' })
  @IsString()
  @MaxLength(255)
  titre: string;

  @Field(() => String, { description: 'Message' })
  @IsNotEmpty({ message: 'Le message est requis' })
  @IsString()
  message: string;

  @Field(() => String, { description: 'Icône', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icone?: string | null;

  @Field(() => String, { description: 'Couleur', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  couleur?: string | null;

  @Field(() => ID, { description: 'ID du véhicule', nullable: true })
  @IsOptional()
  @IsUUID('4')
  vehiculeId?: string | null;

  @Field(() => String, { description: 'Destinataire', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  destinataire?: string | null;

  @Field(() => String, { description: 'Rôle destinataire', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  roleDestinataire?: string | null;

  @Field(() => String, {
    description: 'Metadata JSON string',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  metadata?: string | null;

  @Field(() => String, { description: "URL d'action", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  actionUrl?: string | null;

  @Field(() => String, { description: 'Label action', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  actionLabel?: string | null;

  @Field(() => Date, { description: "Date d'expiration", nullable: true })
  @IsOptional()
  @IsDateString()
  expireLe?: Date | null;

  @Field(() => String, { description: 'Créée par', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  creePar?: string | null;
}
