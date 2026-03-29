import { InputType, Field, Float } from '@nestjs/graphql';
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

@InputType()
export class CreateControleTechniqueInput {
  @Field()
  @IsUUID()
  vehiculeId: string;

  @Field(() => Date)
  @IsNotEmpty()
  @Type(() => Date)
  dateFinValidite: Date;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  montant: number;

  @Field(() => Date)
  @IsNotEmpty()
  @Type(() => Date)
  dateOperation: Date;

  @Field({ nullable: true })
  @IsOptional()
  saisiPar?: string;

  @Field(() => [CreateLigneReglementControleTechniqueInput], {
    nullable: true,
    defaultValue: [],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateLigneReglementControleTechniqueInput)
  lignesReglement?: CreateLigneReglementControleTechniqueInput[];
}
