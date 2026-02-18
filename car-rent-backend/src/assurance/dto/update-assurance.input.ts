import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsOptional, IsString } from 'class-validator';
import { CreateAssuranceInput } from './create-assurance.input';

/**
 * Input pour la mise à jour d'une assurance
 */
@InputType()
export class UpdateAssuranceInput extends PartialType(CreateAssuranceInput) {
  @Field(() => String)
  @IsNotEmpty({ message: "L'ID de l'assurance est obligatoire" })
  @IsUUID('4', { message: "L'ID doit être un UUID valide" })
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  modifiePar?: string;
}
