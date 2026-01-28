import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { UserType } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @Field()
  @IsString()
  phoneNumber: string;

  @Field({ nullable: true, defaultValue: '+216' })
  @IsOptional()
  @IsString()
  countryCodePhone?: string;

  @Field(() => String, { defaultValue: UserType.INDIVIDUAL })
  @IsEnum(UserType)
  userType: UserType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  legalCompanyName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  countryOfRegistration?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  houseNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  googleId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field()
  @IsString()
  roleName: string;

  /**
   * Profile Image URL (optional)
   * Can be set during creation if image is uploaded separately
   */
  @Field(() => String, {
    nullable: true,
    description: 'URL or path to profile image',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profileImage?: string | null;
}
