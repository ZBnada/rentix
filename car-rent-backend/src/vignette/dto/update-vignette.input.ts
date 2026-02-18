import { CreateVignetteInput } from './create-vignette.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVignetteInput extends PartialType(CreateVignetteInput) {
  @Field(() => Int)
  id: number;
}
