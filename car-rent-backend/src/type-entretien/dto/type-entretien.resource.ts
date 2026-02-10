import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

/**
 * Resource GraphQL pour TypeEntretien
 * Représentation exposée via l'API GraphQL
 */
@ObjectType('TypeEntretien')
export class TypeEntretienResource {
  @Field(() => ID, { description: "Identifiant unique du type d'entretien" })
  id: string;

  @Field(() => String, {
    description: "Code du type d'entretien (E01, E02...)",
  })
  codeEntretien: string;

  @Field(() => String, { description: "Désignation du type d'entretien" })
  designation: string;

  @Field(() => String, { description: 'Description détaillée', nullable: true })
  description?: string | null;

  @Field(() => Int, {
    description: 'Fréquence recommandée en jours',
    nullable: true,
  })
  frequenceJoursRecommandee?: number | null;

  @Field(() => Int, {
    description: 'Fréquence recommandée en kilomètres',
    nullable: true,
  })
  frequenceKmRecommandee?: number | null;

  @Field(() => Float, { description: 'Coût moyen estimé' })
  coutMoyenEstime: number;

  @Field(() => Boolean, {
    description: "Indique si l'entretien est obligatoire",
  })
  estObligatoire: boolean;

  @Field(() => String, {
    description: 'Utilisateur ayant saisi',
    nullable: true,
  })
  saisiPar?: string | null;

  @Field(() => String, {
    description: 'Utilisateur ayant modifié',
    nullable: true,
  })
  modifiePar?: string | null;

  @Field(() => Date, { description: 'Date de saisie' })
  saisiLe: Date;

  @Field(() => Date, { description: 'Date de modification' })
  modifieLe: Date;

  @Field(() => Boolean, { description: 'Indique si le type est actif' })
  estActif: boolean;
}
