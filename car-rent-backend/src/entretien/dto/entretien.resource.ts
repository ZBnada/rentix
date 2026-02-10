import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { VehiculeResource } from '../../vehicule/dto/vehicule.resource';
import { TypeEntretienResource } from '../../type-entretien/dto/type-entretien.resource';

/**
 * Resource GraphQL pour Entretien
 * ✅ CORRECTION: Utiliser String au lieu de Date pour éviter les problèmes de sérialisation
 */
@ObjectType('Entretien')
export class EntretienResource {
  @Field(() => ID, { description: "Identifiant unique de l'entretien" })
  id: string;

  // ====== TypeEntretien ======
  @Field(() => ID, { description: "Identifiant du type d'entretien" })
  typeEntretienId: string;

  @Field(() => TypeEntretienResource, {
    description: "Type d'entretien (E01, E02...)",
    nullable: true,
  })
  typeEntretien?: TypeEntretienResource;

  // ====== Vehicule ======
  @Field(() => ID, { description: 'Identifiant du véhicule concerné' })
  vehiculeId: string;

  @Field(() => VehiculeResource, {
    description: 'Véhicule concerné par cet entretien',
    nullable: true,
  })
  vehicule?: VehiculeResource;

  // ====== DATES (String au lieu de Date) ======
  @Field(() => String, {
    description: "Date de début de l'opération (YYYY-MM-DD)",
  })
  dateDebutOperation: string; // ✅ Changé de Date à string

  @Field(() => String, {
    description: "Date de fin de l'opération (YYYY-MM-DD)",
  })
  dateFinOperation: string; // ✅ Changé de Date à string

  // ====== Kilométrage ======
  @Field(() => Number, { description: "Kilométrage à l'arrêt du véhicule" })
  kilometrageArret: number;

  @Field(() => Number, {
    description: 'Kilométrage limite pour le prochain entretien',
    nullable: true,
  })
  kilometrageLimiteProchainEntretien?: number | null;

  @Field(() => String, {
    description: 'Date limite pour le prochain entretien (YYYY-MM-DD)',
    nullable: true,
  })
  dateLimiteProchainEntretien?: string | null; // ✅ Changé de Date à string

  // ====== Personnel ======
  @Field(() => String, {
    description: "Code du personnel ayant effectué l'entretien",
    nullable: true,
  })
  codePersonnel?: string | null;

  @Field(() => String, {
    description: 'Nom et prénom du personnel',
    nullable: true,
  })
  nomPrenomPersonnel?: string | null;

  // ====== Observations ======
  @Field(() => String, { description: 'Observations', nullable: true })
  observations?: string | null;

  // ====== Coût ======
  @Field(() => Float, { description: "Coût total de l'entretien" })
  coutTotal: number;

  // ====== État ======
  @Field(() => String, { description: "État de l'entretien" })
  etat: string;

  // ====== Audit ======
  @Field(() => String, {
    description: 'Utilisateur ayant saisi',
    nullable: true,
  })
  saisiPar?: string | null;

  @Field(() => String, {
    description: 'Utilisateur ayant modifié',
    nullable: true,
  })
  modifiePar?: string | null;

  @Field(() => String, { description: 'Date de saisie (ISO 8601)' })
  saisiLe: string;

  @Field(() => String, { description: 'Date de modification (ISO 8601)' })
  modifieLe: string;

  // ====== Actif ======
  @Field(() => Boolean, { description: "Indique si l'entretien est actif" })
  estActif: boolean;
}
