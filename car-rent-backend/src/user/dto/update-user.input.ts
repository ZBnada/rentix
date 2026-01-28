import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { UserType } from '../entities/user.entity';

@InputType()
export class UpdateUserInput {
  @Field()
  @IsUUID()
  id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  countryCodePhone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  legalCompanyName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  countryOfRegistration?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  houseNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  zipCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profileImage?: string;

  // ✅ Ajout des champs pour AuthService
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  googleId?: string;
}
