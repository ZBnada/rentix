import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsOptional, IsString } from 'class-validator';
import { CreateVehiculeInput } from './create-vehicule.input';

/**
 * Input pour la mise à jour d'un véhicule
 * Étend CreateVehiculeInput avec tous les champs optionnels
 */
@InputType()
export class UpdateVehiculeInput extends PartialType(CreateVehiculeInput) {
  @Field(() => String)
  @IsNotEmpty({ message: "L'ID du véhicule est obligatoire" })
  @IsUUID('4', { message: "L'ID doit être un UUID valide" })
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  modifiePar?: string;
}
