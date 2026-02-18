import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCarnetEntretienInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
