import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

/**
 * Configuration d'un type d'entretien pour un véhicule
 * Utilisé pour afficher les checkboxes
 */
@ObjectType('EntretienConfiguration')
export class EntretienConfigurationResource {
  @Field(() => ID)
  typeEntretienId: string;

  @Field(() => String)
  codeEntretien: string;

  @Field(() => String)
  designation: string;

  @Field(() => Boolean, {
    description: 'Est-ce que cet entretien est coché pour ce véhicule',
  })
  estActive: boolean;

  @Field(() => ID, { nullable: true })
  entretienASuivreId: string | null;

  @Field(() => Int, { nullable: true })
  frequenceJoursRecommandee: number | null;

  @Field(() => Int, { nullable: true })
  frequenceKmRecommandee: number | null;

  @Field(() => Float)
  coutMoyenEstime: number;

  @Field(() => Boolean)
  estObligatoire: boolean;
}
