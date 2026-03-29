import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { VehiculeResource } from '../../vehicule/dto/vehicule.resource';
import { LigneReglementVignetteResource } from './ligne-reglement.resource';
import { StatutVignette } from '../enums/statut-vignette.enum';

@ObjectType('VignetteType')
export class VignetteResource {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  vehiculeId: string;

  @Field(() => VehiculeResource)
  vehicule: VehiculeResource;

  @Field(() => String)
  matriculeVehicule: string;

  // ✅ String pour les champs date MySQL (type 'date' retourne string)
  @Field(() => String)
  dateFinValidite: string;

  @Field(() => Float)
  montant: number;

  @Field(() => Float)
  montantReste: number;

  @Field(() => String)
  dateOperation: string;

  @Field(() => Int)
  numeroFiche: number;

  @Field(() => StatutVignette)
  statut: StatutVignette;

  @Field(() => [LigneReglementVignetteResource])
  lignesReglement: LigneReglementVignetteResource[];

  @Field(() => String, { nullable: true })
  saisiPar?: string;

  @Field(() => String, { nullable: true })
  modifiePar?: string;

  // ✅ Date pour les CreateDateColumn/UpdateDateColumn (retournent vrai Date JS)
  @Field(() => Date)
  saisiLe: Date;

  @Field(() => Date)
  modifieLe: Date;

  @Field(() => Boolean)
  estActif: boolean;
}
