import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ModePaiementResource } from '../../mode-paiement/dto/mode-paiement.resource';

@ObjectType('LigneReglementVignetteType')
export class LigneReglementVignetteResource {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  vignetteId: string;

  @Field(() => String)
  modePaiementId: string;

  @Field(() => ModePaiementResource)
  modePaiement: ModePaiementResource;

  @Field(() => String, { nullable: true })
  designation?: string;

  @Field(() => Float)
  montant: number;

  // ✅ String au lieu de Date — évite le conflit DateTime scalar
  @Field(() => String, { nullable: true })
  echeance?: string;

  @Field(() => String, { nullable: true })
  referencePiece?: string;

  @Field(() => String, { nullable: true })
  banque?: string;

  @Field(() => String, { nullable: true })
  porteur?: string;

  // ✅ String au lieu de Date
  @Field(() => String)
  dateOperation: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Boolean)
  estActif: boolean;
}
