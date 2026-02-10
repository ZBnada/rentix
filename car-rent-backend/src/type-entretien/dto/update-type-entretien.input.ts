import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateTypeEntretienInput } from './create-type-entretien.input';

/**
 * Input GraphQL pour mettre à jour un type d'entretien
 * Tous les champs sont optionnels sauf l'ID
 */
@InputType('UpdateTypeEntretienInput')
export class UpdateTypeEntretienInput extends PartialType(
  CreateTypeEntretienInput,
) {
  @Field(() => ID, {
    description: "Identifiant du type d'entretien à modifier",
  })
  @IsNotEmpty({ message: "L'identifiant est requis" })
  @IsUUID('4', { message: 'Identifiant invalide' })
  id: string;
}
