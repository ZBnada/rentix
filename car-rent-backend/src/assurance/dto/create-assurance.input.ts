import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAssuranceReglementInput } from './create-assurance-reglement.input';

/**
 * Input pour la création d'une assurance
 */
@InputType()
export class CreateAssuranceInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Le véhicule est obligatoire' })
  @IsUUID('4', { message: "L'ID du véhicule doit être un UUID valide" })
  vehiculeId: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Le prestataire est obligatoire' })
  @IsString()
  prestataire: string;

  @Field(() => Date)
  @IsNotEmpty({ message: 'La date de début est obligatoire' })
  @Type(() => Date)
  dateDebut: Date;

  @Field(() => Date)
  @IsNotEmpty({ message: 'La date de fin de validité est obligatoire' })
  @Type(() => Date)
  dateFinValidite: Date;

  @Field(() => Float)
  @IsNotEmpty({ message: 'Le montant total est obligatoire' })
  @IsNumber()
  montantTotal: number;

  @Field(() => Date)
  @IsNotEmpty({ message: "La date d'opération est obligatoire" })
  @Type(() => Date)
  dateOperation: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  numeroPolice?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  observations?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  documentUrl?: string;

  @Field(() => [CreateAssuranceReglementInput])
  @IsArray()
  @Type(() => CreateAssuranceReglementInput)
  reglements: CreateAssuranceReglementInput[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  saisiPar?: string;
}
