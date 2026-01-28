import { ObjectType, Field } from '@nestjs/graphql';
import { UserResource } from '../../user/dto/resources/user.resource';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => UserResource)
  user: UserResource;
}

@ObjectType()
export class MessageResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@ObjectType()
export class ResendCodeResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field()
  expiresAt: Date;
}
