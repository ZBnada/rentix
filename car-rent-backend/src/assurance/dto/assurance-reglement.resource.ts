import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ModePaiementResource } from '../../mode-paiement/dto/mode-paiement.resource';

/**
 * Resource GraphQL pour AssuranceReglement
 */
@ObjectType('AssuranceReglement')
export class AssuranceReglementResource {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  assuranceId: string;

  @Field(() => String)
  modePaiementId: string;

  @Field(() => ModePaiementResource)
  modePaiement: ModePaiementResource;

  @Field(() => String, { nullable: true })
  designation?: string;

  @Field(() => Float)
  montant: number;

  @Field(() => String, { nullable: true })
  echeance?: Date;

  @Field(() => String, { nullable: true })
  referencePiece?: string;

  @Field(() => String, { nullable: true })
  banque?: string;

  @Field(() => String, { nullable: true })
  porteur?: string;

  @Field(() => String)
  dateOperation: Date;

  @Field(() => String)
  createdAt: Date;

  @Field(() => Boolean)
  estActif: boolean;
}
