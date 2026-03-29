import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { StatutControleTechnique } from '../enums/statut-controle-technique.enum';
import { VehiculeResource } from '../../vehicule/dto/vehicule.resource';
import { LigneReglementControleTechniqueResource } from './ligne-reglement-controle-technique.resource';

@ObjectType()
export class ControleTechniqueResource {
  @Field()
  id: string;

  @Field()
  vehiculeId: string;

  @Field(() => VehiculeResource)
  vehicule: VehiculeResource;

  @Field()
  matriculeVehicule: string;

  @Field(() => Int)
  numeroFiche: number;

  @Field()
  dateFinValidite: string;

  @Field(() => Float)
  montant: number;

  @Field(() => Float)
  montantReste: number;

  @Field()
  dateOperation: string;

  @Field(() => StatutControleTechnique)
  statut: StatutControleTechnique;

  @Field(() => [LigneReglementControleTechniqueResource])
  lignesReglement: LigneReglementControleTechniqueResource[];

  @Field({ nullable: true })
  saisiPar?: string;

  @Field({ nullable: true })
  modifiePar?: string;

  @Field({ nullable: true })
  validePar?: string;

  @Field({ nullable: true })
  annulePar?: string;

  @Field(() => Date)
  saisiLe: Date;

  @Field(() => Date)
  modifieLe: Date;
}
