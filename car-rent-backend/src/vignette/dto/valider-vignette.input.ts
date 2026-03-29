import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

/**
 * Input pour la validation d'une vignette
 */
@InputType()
export class ValiderVignetteInput {
  @Field(() => String)
  @IsNotEmpty({ message: "L'ID de la vignette est obligatoire" })
  @IsUUID('4', { message: "L'ID doit être un UUID valide" })
  id: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Le nom du valideur est obligatoire' })
  @IsString()
  validerPar: string;
}
