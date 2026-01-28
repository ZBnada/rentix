import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { UserResource } from '../dto/resources/user.resource';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { RoleMapper } from '../../role/mappers/role.mapper';

/**
 * User Mapper
 * Handles mapping between User Entity and UserResource/DTOs
 * NEVER expose entities directly in GraphQL
 */
@Injectable()
export class UserMapper {
  constructor(
    private readonly configService: ConfigService,
    private readonly roleMapper: RoleMapper,
  ) {}

  /**
   * Entity → Resource (for GraphQL responses)
   * Maps User entity to UserResource
   */
  toResource(entity: User): UserResource {
    const resource = new UserResource();

    resource.id = entity.id;
    resource.firstName = entity.firstName;
    resource.lastName = entity.lastName;
    resource.email = entity.email;
    resource.countryCodePhone = entity.countryCodePhone;
    resource.phoneNumber = entity.phoneNumber;
    resource.userType = entity.userType;
    resource.legalCompanyName = entity.legalCompanyName;
    resource.countryOfRegistration = entity.countryOfRegistration;
    resource.streetAddress = entity.streetAddress;
    resource.houseNumber = entity.houseNumber;
    resource.zipCode = entity.zipCode;
    resource.city = entity.city;
    resource.isEmailVerified = entity.isEmailVerified;
    resource.emailVerifiedAt = entity.emailVerifiedAt ?? undefined;
    resource.lastLoginAt = entity.lastLoginAt ?? undefined;
    resource.isActive = entity.isActive;
    resource.createdAt = entity.createdAt;
    resource.updatedAt = entity.updatedAt;

    // Map profile image with full URL
    resource.profileImage =
      this.getFullImageUrl(entity.profileImage) ?? undefined;

    // Compute initials
    resource.initials = entity.getInitials();

    // Map role if present (handle nullable)
    if (entity.role) {
      const mappedRole = this.roleMapper.toResource(entity.role);
      resource.role = mappedRole ?? undefined;
    }

    return resource;
  }

  /**
   * Entity Array → Resource Array
   */
  toResourceArray(entities: User[]): UserResource[] {
    return entities.map((entity) => this.toResource(entity));
  }

  /**
   * Input → Entity (for creating new users)
   * Maps CreateUserInput to User entity
   */
  toEntity(input: CreateUserInput): Partial<User> {
    return {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      countryCodePhone: input.countryCodePhone || '+216',
      phoneNumber: input.phoneNumber,
      userType: input.userType,
      legalCompanyName: input.legalCompanyName,
      countryOfRegistration: input.countryOfRegistration,
      streetAddress: input.streetAddress,
      houseNumber: input.houseNumber,
      zipCode: input.zipCode,
      city: input.city,
      profileImage: input.profileImage || null,
    };
  }

  /**
   * Update Input → Entity (for updating users)
   * Maps UpdateUserInput to partial User entity
   */
  toUpdateEntity(input: UpdateUserInput): Partial<User> {
    const updateData: Partial<User> = {};

    if (input.firstName !== undefined) updateData.firstName = input.firstName;
    if (input.lastName !== undefined) updateData.lastName = input.lastName;
    if (input.email !== undefined) updateData.email = input.email;
    if (input.password !== undefined) updateData.password = input.password;
    if (input.googleId !== undefined) updateData.googleId = input.googleId;
    if (input.countryCodePhone !== undefined)
      updateData.countryCodePhone = input.countryCodePhone;
    if (input.phoneNumber !== undefined)
      updateData.phoneNumber = input.phoneNumber;
    if (input.userType !== undefined) updateData.userType = input.userType;
    if (input.legalCompanyName !== undefined)
      updateData.legalCompanyName = input.legalCompanyName;
    if (input.countryOfRegistration !== undefined)
      updateData.countryOfRegistration = input.countryOfRegistration;
    if (input.streetAddress !== undefined)
      updateData.streetAddress = input.streetAddress;
    if (input.houseNumber !== undefined)
      updateData.houseNumber = input.houseNumber;
    if (input.zipCode !== undefined) updateData.zipCode = input.zipCode;
    if (input.city !== undefined) updateData.city = input.city;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;
    if (input.roleId !== undefined) updateData.roleId = input.roleId;
    if (input.profileImage !== undefined)
      updateData.profileImage = input.profileImage;

    return updateData;
  }

  /**
   * Convert relative image path to full URL
   * Handles both relative paths and full URLs
   */
  private getFullImageUrl(imagePath: string | null): string | null {
    if (!imagePath) {
      return null;
    }

    // Already a full URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Build full URL from base URL
    const baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    return `${baseUrl}${imagePath}`;
  }

  /**
   * Generate default profile image URL
   * Useful for generating avatar placeholders
   */
  getDefaultProfileImage(firstName: string, lastName: string): string {
    const initials =
      `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    // You can use services like ui-avatars.com or DiceBear
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=FF5F00&color=fff&size=200&bold=true`;
  }
}
