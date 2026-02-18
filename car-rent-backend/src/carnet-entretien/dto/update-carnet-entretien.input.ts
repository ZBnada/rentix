import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class UpdateCarnetEntretienInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFin?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  kilometrageFin?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  coutReel?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  statut?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  modifiePar?: string;
}
