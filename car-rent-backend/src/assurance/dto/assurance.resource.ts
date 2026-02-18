import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { VehiculeResource } from '../../vehicule/dto/vehicule.resource';
import { AssuranceReglementResource } from './assurance-reglement.resource';

/**
 * Resource GraphQL pour Assurance
 */
@ObjectType('Assurance')
export class AssuranceResource {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  vehiculeId: string;

  @Field(() => VehiculeResource)
  vehicule: VehiculeResource;

  @Field(() => String)
  prestataire: string;

  @Field(() => String)
  dateDebut: Date;

  @Field(() => String)
  dateFinValidite: Date;

  @Field(() => Float)
  montantTotal: number;

  @Field(() => String)
  dateOperation: Date;

  @Field(() => String, { nullable: true })
  numeroPolice?: string;

  @Field(() => String, { nullable: true })
  observations?: string;

  @Field(() => String, { nullable: true })
  documentUrl: string | null;

  @Field(() => [AssuranceReglementResource])
  reglements: AssuranceReglementResource[];

  @Field(() => String, { nullable: true })
  saisiPar?: string;

  @Field(() => String, { nullable: true })
  modifiePar?: string;

  @Field(() => String)
  saisiLe: Date;

  @Field(() => String)
  modifieLe: Date;

  @Field(() => Boolean)
  estActif: boolean;
}
