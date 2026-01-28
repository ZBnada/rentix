import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType('Role')
export class RoleResource {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Int)
  weight: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
