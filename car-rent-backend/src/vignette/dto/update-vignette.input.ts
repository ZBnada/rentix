import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsOptional, IsString } from 'class-validator';
import { CreateVignetteInput } from './create-vignette.input';

@InputType()
export class UpdateVignetteInput extends PartialType(CreateVignetteInput) {
  @Field(() => String)
  @IsNotEmpty({ message: "L'ID de la vignette est obligatoire" })
  @IsUUID('4')
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  modifiePar?: string;
}
