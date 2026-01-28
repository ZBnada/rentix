import { InputType, Field, Int, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  MaxLength,
  IsUUID,
} from 'class-validator';

@InputType()
export class UpdateRoleInput {
  @Field(() => ID)
  @IsNotEmpty({ message: "L'ID du rôle est obligatoire" })
  @IsUUID('4', { message: 'ID invalide' })
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Le nom ne doit pas dépasser 50 caractères' })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'Le poids doit être un nombre entier' })
  @Min(0, { message: 'Le poids minimum est 0 (admin)' })
  @Max(100, { message: 'Le poids maximum est 100' })
  weight?: number;
}
