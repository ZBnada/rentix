import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * Resource GraphQL pour MarqueVehicule
 * Représente les données exposées via l'API GraphQL
 */
@ObjectType('MarqueVehicule')
export class MarqueVehiculeResource {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  libelle: string;

  @Field(() => String, { nullable: true })
  logoUrl?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Boolean)
  estActif: boolean;
}
