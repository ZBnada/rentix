import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLigneReglementVignetteInput } from './create-ligne-reglement.input';

@InputType()
export class CreateVignetteInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Le véhicule est obligatoire' })
  @IsUUID('4', { message: "L'ID du véhicule doit être un UUID valide" })
  vehiculeId: string;

  @Field(() => Date)
  @IsNotEmpty({ message: 'La date de fin de validité est obligatoire' })
  @Type(() => Date)
  dateFinValidite: Date;

  @Field(() => Float)
  @IsNotEmpty({ message: 'Le montant est obligatoire' })
  @IsNumber()
  montant: number;

  @Field(() => Date)
  @IsNotEmpty({ message: "La date d'opération est obligatoire" })
  @Type(() => Date)
  dateOperation: Date;

  @Field(() => [CreateLigneReglementVignetteInput])
  @IsArray()
  @Type(() => CreateLigneReglementVignetteInput)
  lignesReglement: CreateLigneReglementVignetteInput[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  saisiPar?: string;
}
