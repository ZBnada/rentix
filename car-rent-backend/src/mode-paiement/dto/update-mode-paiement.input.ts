import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateModePaiementInput } from './create-mode-paiement.input';

/**
 * Input pour la mise à jour d'un mode de paiement
 */
@InputType()
export class UpdateModePaiementInput extends PartialType(
  CreateModePaiementInput,
) {
  @Field(() => String)
  @IsNotEmpty({ message: "L'ID du mode de paiement est obligatoire" })
  @IsUUID('4', { message: "L'ID doit être un UUID valide" })
  id: string;
}
