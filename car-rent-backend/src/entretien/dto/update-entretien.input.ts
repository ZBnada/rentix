import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateEntretienInput } from './create-entretien.input';

/**
 * Input GraphQL pour mettre à jour un entretien
 * Tous les champs sont optionnels sauf l'ID
 */
@InputType('UpdateEntretienInput')
export class UpdateEntretienInput extends PartialType(CreateEntretienInput) {
  @Field(() => ID, { description: "Identifiant de l'entretien à modifier" })
  @IsNotEmpty({ message: "L'identifiant de l'entretien est requis" })
  @IsUUID('4', { message: 'Identifiant invalide' })
  id: string;
}
