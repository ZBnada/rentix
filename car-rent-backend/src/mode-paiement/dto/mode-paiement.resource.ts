import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ModePaiement } from '../enums/mode-paiement.enum';

/**
 * Resource GraphQL pour ModePaiement
 * Représente les données exposées via l'API GraphQL
 */
@ObjectType('ModePaiementType')
export class ModePaiementResource {
  @Field(() => ID)
  id: string;

  @Field(() => ModePaiement)
  type: ModePaiement;

  @Field(() => String)
  libelle: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  icon?: string;

  @Field(() => Boolean)
  estActif: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
