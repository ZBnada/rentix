import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

/**
 * Input pour la création d'une marque de véhicule
 */
@InputType()
export class CreateMarqueVehiculeInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: "L'ID doit être un UUID valide" })
  id?: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Le libellé est obligatoire' })
  @IsString()
  libelle: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
