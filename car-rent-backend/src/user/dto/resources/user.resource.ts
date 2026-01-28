import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from '../../entities/user.entity';
import { RoleResource } from '../../../role/dto/resources/role.resource';

@ObjectType()
export class UserResource {
  @Field()
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  countryCodePhone: string;

  @Field()
  phoneNumber: string;

  @Field(() => String)
  userType: UserType;

  @Field(() => String, { nullable: true })
  legalCompanyName?: string;

  @Field(() => String, { nullable: true })
  countryOfRegistration?: string;

  @Field(() => String, { nullable: true })
  streetAddress?: string;

  @Field(() => String, { nullable: true })
  houseNumber?: string;

  @Field(() => String, { nullable: true })
  zipCode?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field()
  isEmailVerified: boolean;

  @Field(() => Date, { nullable: true })
  emailVerifiedAt?: Date;

  @Field(() => Date, { nullable: true })
  lastLoginAt?: Date;

  @Field()
  isActive: boolean;

  @Field(() => String, { nullable: true })
  profileImage?: string;

  @Field()
  initials: string;

  @Field(() => RoleResource, { nullable: true })
  role?: RoleResource;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
