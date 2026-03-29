import { InputType, Field, Float, PartialType } from '@nestjs/graphql';
import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLigneReglementControleTechniqueInput } from './create-ligne-reglement-controle-technique.input';
import { CreateControleTechniqueInput } from './create-controle-technique.input';

@InputType()
export class UpdateControleTechniqueInput extends PartialType(
  CreateControleTechniqueInput,
) {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  modifiePar?: string;
}
