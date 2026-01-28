import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean, IsEnum, Min } from 'class-validator';
import { UserType } from '../entities/user.entity';

export enum UserSortField {
  CREATED_AT = 'createdAt',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

@InputType()
export class UserFilterInput {
  // Recherche
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string; // Recherche dans firstName, lastName, email

  // Filtres
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  roleId?: string;

  @Field(() => UserType, { nullable: true })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // Tri
  @Field(() => String, {
    nullable: true,
    defaultValue: UserSortField.CREATED_AT,
  })
  @IsOptional()
  sortField?: UserSortField;

  @Field(() => String, { nullable: true, defaultValue: SortOrder.DESC })
  @IsOptional()
  sortOrder?: SortOrder;

  // Pagination
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @Min(1)
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @Min(1)
  limit?: number;
}
