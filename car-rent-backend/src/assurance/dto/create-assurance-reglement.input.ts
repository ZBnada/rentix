import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Input pour la création d'un règlement d'assurance
 */
@InputType()
export class CreateAssuranceReglementInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Le mode de paiement est obligatoire' })
  @IsUUID('4', { message: "L'ID du mode de paiement doit être un UUID valide" })
  modePaiementId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  designation?: string;

  @Field(() => Float)
  @IsNotEmpty({ message: 'Le montant est obligatoire' })
  @IsNumber()
  montant: number;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @Type(() => Date)
  echeance?: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  referencePiece?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  banque?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  porteur?: string;

  @Field(() => Date)
  @IsNotEmpty({ message: "La date d'opération est obligatoire" })
  @Type(() => Date)
  dateOperation: Date;
}
