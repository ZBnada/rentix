import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ModePaiement } from '../enums/mode-paiement.enum';

/**
 * Input pour la création d'un mode de paiement
 */
@InputType()
export class CreateModePaiementInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: "L'ID doit être un UUID valide" })
  id?: string;

  @Field(() => ModePaiement)
  @IsNotEmpty({ message: 'Le type de paiement est obligatoire' })
  @IsEnum(ModePaiement, { message: 'Type de paiement invalide' })
  type: ModePaiement;

  @Field(() => String)
  @IsNotEmpty({ message: 'Le libellé est obligatoire' })
  @IsString()
  libelle: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  icon?: string;
}
