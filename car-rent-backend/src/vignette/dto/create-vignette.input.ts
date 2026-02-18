import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVignetteInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
