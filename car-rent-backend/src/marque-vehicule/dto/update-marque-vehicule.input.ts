import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateMarqueVehiculeInput } from './create-marque-vehicule.input';

/**
 * Input pour la mise à jour d'une marque de véhicule
 */
@InputType()
export class UpdateMarqueVehiculeInput extends PartialType(
  CreateMarqueVehiculeInput,
) {
  @Field(() => String)
  @IsNotEmpty({ message: "L'ID de la marque est obligatoire" })
  @IsUUID('4', { message: "L'ID doit être un UUID valide" })
  id: string;
}
