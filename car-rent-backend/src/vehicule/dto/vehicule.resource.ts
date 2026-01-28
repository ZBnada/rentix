import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { EnergieType } from '../enums/energie.enum';
import { ClasseVehicule } from '../enums/classe-vehicule.enum';
import { MarqueVehiculeResource } from '../../marque-vehicule/dto/marque-vehicule.resource';

/**
 * Resource GraphQL pour Véhicule
 * Représente les données exposées via l'API GraphQL
 */
@ObjectType('Vehicule')
export class VehiculeResource {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  matricule: string;

  @Field(() => String)
  marqueId: string;

  @Field(() => MarqueVehiculeResource)
  marque: MarqueVehiculeResource;

  @Field(() => String)
  type: string;

  @Field(() => Date)
  datePremiereMiseEnCirculation: Date;

  @Field(() => Int)
  puissance: number;

  @Field(() => EnergieType)
  energie: EnergieType;

  @Field(() => Int)
  compteur: number;

  @Field(() => String, { nullable: true })
  couleur: string | null;

  @Field(() => Float)
  prixAchat: number;

  @Field(() => ClasseVehicule)
  classeVehicule: ClasseVehicule;

  @Field(() => Float)
  prixLocationJournee: number;

  @Field(() => Float)
  prixHeureRetard: number;

  @Field(() => Boolean)
  roueSecours: boolean;

  @Field(() => Boolean)
  cricManivelle: boolean;

  @Field(() => Boolean)
  jeuHousse: boolean;

  @Field(() => Boolean)
  siegeBebe: boolean;

  @Field(() => Boolean)
  jeuTapis: boolean;

  @Field(() => Boolean)
  posteRadio: boolean;

  @Field(() => Boolean)
  jeuEnjoliveurs: boolean;

  @Field(() => String, { nullable: true })
  observations: string | null;

  @Field(() => String, { nullable: true })
  imageUrl: string | null;

  @Field(() => String, { nullable: true })
  saisiPar: string | null;

  @Field(() => String, { nullable: true })
  modifiePar: string | null;

  @Field(() => Date)
  saisiLe: Date;

  @Field(() => Date)
  modifieLe: Date;

  @Field(() => Boolean)
  estActif: boolean;
}
