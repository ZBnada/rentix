import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateRoleInput {
  @Field()
  @IsNotEmpty({ message: 'Le nom du rôle est obligatoire' })
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { defaultValue: 60 })
  @IsInt()
  @Min(0, { message: 'Le poids minimum est 0' })
  @Max(100, { message: 'Le poids maximum est 100' })
  weight: number;
}
