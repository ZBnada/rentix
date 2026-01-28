import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UserMapper } from './mappers/user.mapper';
import { UserResource } from './dto/resources/user.resource';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  /**
   * POST /users/create-with-image
   * Créer un utilisateur avec une image de profil
   */
  @Post('create-with-image')
  @UseInterceptors(FileInterceptor('file'))
  async createUserWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ): Promise<UserResource> {
    // Construire l'input à partir du body
    const input: CreateUserInput = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      phoneNumber: body.phoneNumber,
      countryCodePhone: body.countryCodePhone || '+216',
      userType: body.userType,
      roleName: body.roleName,
      legalCompanyName: body.legalCompanyName,
      countryOfRegistration: body.countryOfRegistration,
      streetAddress: body.streetAddress,
      houseNumber: body.houseNumber,
      zipCode: body.zipCode,
      city: body.city,
      isActive: body.isActive === 'true' || body.isActive === true,
      isEmailVerified:
        body.isEmailVerified === 'true' || body.isEmailVerified === true,
      googleId: body.googleId,
    };

    // Créer l'utilisateur d'abord
    const user = await this.userService.create(input);

    // Si un fichier est fourni, uploader l'image
    if (file) {
      const updatedUser = await this.userService.uploadProfileImage(
        user.id,
        file,
      );
      const resource = this.userMapper.toResource(updatedUser);
      if (!resource) throw new Error('Erreur lors de la création');
      return resource;
    }

    const resource = this.userMapper.toResource(user);
    if (!resource) throw new Error('Erreur lors de la création');
    return resource;
  }

  /**
   * PUT /users/:id/update-with-image
   * Mettre à jour un utilisateur avec une image de profil
   */
  @Put(':id/update-with-image')
  @UseInterceptors(FileInterceptor('file'))
  async updateUserWithImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ): Promise<UserResource> {
    // Construire l'input à partir du body
    const input: UpdateUserInput = {
      id: id, // ← Ajouter l'id depuis le param
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      countryCodePhone: body.countryCodePhone,
      userType: body.userType,
      legalCompanyName: body.legalCompanyName,
      countryOfRegistration: body.countryOfRegistration,
      streetAddress: body.streetAddress,
      houseNumber: body.houseNumber,
      zipCode: body.zipCode,
      city: body.city,
      isActive:
        body.isActive !== undefined
          ? body.isActive === 'true' || body.isActive === true
          : undefined,
    };

    // Mettre à jour les données utilisateur
    const user = await this.userService.update(id, input);

    // Si un fichier est fourni, uploader la nouvelle image
    if (file) {
      const updatedUser = await this.userService.uploadProfileImage(id, file);
      const resource = this.userMapper.toResource(updatedUser);
      if (!resource) throw new Error('Erreur lors de la mise à jour');
      return resource;
    }

    const resource = this.userMapper.toResource(user);
    if (!resource) throw new Error('Erreur lors de la mise à jour');
    return resource;
  }

  /**
   * POST /users/me/profile-image
   * Upload d'une image de profil pour l'utilisateur connecté
   */
  @UseGuards(JwtAuthGuard)
  @Post('me/profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMyProfileImage(
    @CurrentUser() currentUser: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserResource> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const user = await this.userService.uploadProfileImage(
      currentUser.id,
      file,
    );
    return this.userMapper.toResource(user);
  }

  /**
   * DELETE /users/me/profile-image
   * Supprimer l'image de profil de l'utilisateur connecté
   */
  @UseGuards(JwtAuthGuard)
  @Delete('me/profile-image')
  async deleteMyProfileImage(
    @CurrentUser() currentUser: User,
  ): Promise<UserResource> {
    const user = await this.userService.deleteProfileImage(currentUser.id);
    return this.userMapper.toResource(user);
  }

  /**
   * POST /users/:userId/profile-image
   * Upload d'une image de profil (Admin uniquement)
   */
  @UseGuards(JwtAuthGuard)
  @Post(':userId/profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('userId') userId: string,
    @CurrentUser() currentUser: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserResource> {
    const isAdmin = currentUser.role?.name === 'ADMIN';
    const isOwnProfile = currentUser.id === userId;

    if (!isOwnProfile && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que votre propre profil',
      );
    }

    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const user = await this.userService.uploadProfileImage(userId, file);
    return this.userMapper.toResource(user);
  }

  /**
   * DELETE /users/:userId/profile-image
   * Supprimer l'image de profil (Admin uniquement)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':userId/profile-image')
  async deleteProfileImage(
    @Param('userId') userId: string,
    @CurrentUser() currentUser: User,
  ): Promise<UserResource> {
    const isAdmin = currentUser.role?.name === 'ADMIN';
    const isOwnProfile = currentUser.id === userId;

    if (!isOwnProfile && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que votre propre profil',
      );
    }

    const user = await this.userService.deleteProfileImage(userId);
    return this.userMapper.toResource(user);
  }
}
