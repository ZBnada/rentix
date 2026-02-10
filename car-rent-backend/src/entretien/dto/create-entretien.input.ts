import { InputType, Field, ID, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsInt,
  IsOptional,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

/**
 * Input GraphQL pour créer un entretien
 * ✅ CORRECTION: Utilisation de string pour les dates au lieu de @IsDateString
 */
@InputType('CreateEntretienInput')
export class CreateEntretienInput {
  // ====== TypeEntretien ======
  @Field(() => ID, {
    description: "Identifiant du type d'entretien (E01, E02...)",
  })
  @IsNotEmpty({ message: "Le type d'entretien est requis" })
  @IsUUID('4', { message: 'Identifiant de type invalide' })
  typeEntretienId: string;

  // ====== Vehicule ======
  @Field(() => ID, { description: 'Identifiant du véhicule' })
  @IsNotEmpty({ message: 'Le véhicule est requis' })
  @IsUUID('4', { message: 'Identifiant de véhicule invalide' })
  vehiculeId: string;

  // ====== DATES (String au lieu de Date) ======
  @Field(() => String, {
    description: "Date de début de l'opération (YYYY-MM-DD)",
  })
  @IsNotEmpty({ message: 'La date de début est requise' })
  @IsString()
  dateDebutOperation: string; // ✅ Changé en string

  @Field(() => String, {
    description: "Date de fin de l'opération (YYYY-MM-DD)",
  })
  @IsNotEmpty({ message: 'La date de fin est requise' })
  @IsString()
  dateFinOperation: string; // ✅ Changé en string

  // ====== Kilométrage ======
  @Field(() => Number, { description: "Kilométrage à l'arrêt" })
  @IsNotEmpty({ message: "Le kilométrage à l'arrêt est requis" })
  @IsInt({ message: 'Le kilométrage doit être un nombre entier' })
  @Min(0, { message: 'Le kilométrage ne peut pas être négatif' })
  kilometrageArret: number;

  @Field(() => Number, {
    description: 'Kilométrage limite pour le prochain entretien',
    nullable: true,
  })
  @IsOptional()
  @IsInt({ message: 'Le kilométrage doit être un nombre entier' })
  @Min(0)
  kilometrageLimiteProchainEntretien?: number | null;

  @Field(() => String, {
    description: 'Date limite pour le prochain entretien (YYYY-MM-DD)',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  dateLimiteProchainEntretien?: string | null;

  // ====== Personnel ======
  @Field(() => String, { description: 'Code du personnel', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  codePersonnel?: string | null;

  @Field(() => String, {
    description: 'Nom et prénom du personnel',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nomPrenomPersonnel?: string | null;

  // ====== Observations ======
  @Field(() => String, { description: 'Observations', nullable: true })
  @IsOptional()
  @IsString()
  observations?: string | null;

  // ====== Coût ======
  @Field(() => Float, {
    description: "Coût total de l'entretien",
    defaultValue: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Le coût doit être un nombre' })
  @Min(0, { message: 'Le coût ne peut pas être négatif' })
  coutTotal?: number;

  // ====== État ======
  @Field(() => String, {
    description: "État de l'entretien",
    defaultValue: 'TERMINE',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  etat?: string;
}
