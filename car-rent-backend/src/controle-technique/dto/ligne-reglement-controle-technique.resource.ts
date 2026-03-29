import { ObjectType, Field, Float } from '@nestjs/graphql';
import { ModePaiementResource } from '../../mode-paiement/dto/mode-paiement.resource';

@ObjectType()
export class LigneReglementControleTechniqueResource {
  @Field()
  id: string;

  @Field()
  controleTechniqueId: string;

  @Field()
  modePaiementId: string;

  @Field(() => ModePaiementResource)
  modePaiement: ModePaiementResource;

  @Field({ nullable: true })
  designation?: string;

  @Field(() => Float)
  montant: number;

  @Field({ nullable: true })
  echeance?: string;

  @Field({ nullable: true })
  referencePiece?: string;

  @Field({ nullable: true })
  banque?: string;

  @Field({ nullable: true })
  porteur?: string;

  @Field()
  dateOperation: string;

  @Field(() => Date)
  createdAt: Date;
}
