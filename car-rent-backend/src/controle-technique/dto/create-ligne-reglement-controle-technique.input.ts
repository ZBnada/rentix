import { InputType, Field, Float } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateLigneReglementControleTechniqueInput {
  @Field()
  @IsUUID()
  modePaiementId: string;

  @Field({ nullable: true })
  @IsOptional()
  designation?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0.001)
  montant: number;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @Type(() => Date)
  echeance?: Date;

  @Field({ nullable: true })
  @IsOptional()
  referencePiece?: string;

  @Field({ nullable: true })
  @IsOptional()
  banque?: string;

  @Field({ nullable: true })
  @IsOptional()
  porteur?: string;

  @Field(() => Date)
  @IsNotEmpty()
  @Type(() => Date)
  dateOperation: Date;
}
