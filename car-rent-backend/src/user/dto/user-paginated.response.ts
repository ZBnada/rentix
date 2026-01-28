import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserResource } from './resources/user.resource';

@ObjectType()
export class UserPaginatedResponse {
  @Field(() => [UserResource])
  users: UserResource[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}

@ObjectType()
export class UserStatsResponse {
  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  activeUsers: number;

  @Field(() => Int)
  inactiveUsers: number;

  @Field(() => Int)
  verifiedEmails: number;

  @Field(() => Int)
  unverifiedEmails: number;

  @Field(() => Int)
  individualUsers: number;

  @Field(() => Int)
  companyUsers: number;
}
