import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserType } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserFilterInput } from './dto/user-filter.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { ChangeEmailInput } from './dto/change-email.input';
import { RoleService } from '../role/role.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * CREATE - Créer un utilisateur
   */
  async create(input: CreateUserInput): Promise<User> {
    // Vérifier si l'email existe déjà
    const exists = await this.userRepository.findOne({
      where: { email: input.email },
    });

    if (exists) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Récupérer le rôle par son nom
    const role = await this.roleService.findByName(input.roleName);

    // Créer les données utilisateur
    const userData = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      phoneNumber: input.phoneNumber,
      countryCodePhone: input.countryCodePhone || '+216',
      userType: input.userType,
      legalCompanyName: input.legalCompanyName,
      countryOfRegistration: input.countryOfRegistration,
      streetAddress: input.streetAddress,
      houseNumber: input.houseNumber,
      zipCode: input.zipCode,
      city: input.city,
      googleId: input.googleId,
      isEmailVerified: input.isEmailVerified ?? false,
      isActive: input.isActive ?? true,
      roleId: role.id,
      profileImage: input.profileImage || null,
    };

    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);

    // Recharger avec les relations
    return this.findOne(savedUser.id);
  }

  /**
   * READ - Liste avec filtrage et pagination
   */
  async findAllWithFilters(
    filter: UserFilterInput,
  ): Promise<{ users: User[]; total: number }> {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    if (filter.search) {
      queryBuilder.where(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${filter.search}%` },
      );
    }

    if (filter.roleId) {
      queryBuilder.andWhere('user.roleId = :roleId', { roleId: filter.roleId });
    }

    if (filter.userType) {
      queryBuilder.andWhere('user.userType = :userType', {
        userType: filter.userType,
      });
    }

    if (filter.isEmailVerified !== undefined) {
      queryBuilder.andWhere('user.isEmailVerified = :isEmailVerified', {
        isEmailVerified: filter.isEmailVerified,
      });
    }

    if (filter.isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', {
        isActive: filter.isActive,
      });
    }

    const sortField = filter.sortField || 'createdAt';
    const sortOrder = filter.sortOrder || 'DESC';
    queryBuilder.orderBy(`user.${sortField}`, sortOrder as 'ASC' | 'DESC');

    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return { users, total };
  }

  /**
   * READ - Tous les utilisateurs (sans filtre)
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['role'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * READ - Un utilisateur par ID
   */
  async findOne(id: string): Promise<User> {
    console.log('🔍 UserService.findOne - Searching for ID:', id);

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'], // ⚠️ VERY IMPORTANT - Without this, role will be null!
    });

    if (!user) {
      console.error('❌ UserService.findOne - User not found in database');
      throw new NotFoundException(`Utilisateur avec ID ${id} introuvable`);
    }

    console.log('✅ UserService.findOne - User found:', {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      hasRole: !!user.role,
      roleName: user.role?.name,
      roleId: user.roleId
    });

    return user;
  }

  /**
   * READ - Par email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  /**
   * READ - Par Google ID
   */
  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { googleId },
      relations: ['role'],
    });
  }

  /**
   * UPDATE - Mise à jour générale
   */
  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);

    if (input.email && input.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: input.email },
      });

      if (emailExists) {
        throw new ConflictException(
          'Un utilisateur avec cet email existe déjà',
        );
      }
    }

    Object.assign(user, input);
    return this.userRepository.save(user);
  }

  /**
   * UPLOAD PROFILE IMAGE - Upload d'image de profil
   */
  async uploadProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.findOne(userId);

    // Supprimer l'ancienne image si elle existe
    if (user.profileImage) {
      await this.uploadService.deleteProfileImage(user.profileImage);
    }

    // Upload de la nouvelle image
    const uploadedFile = await this.uploadService.uploadProfileImage(
      file,
      userId,
    );

    // Mettre à jour l'utilisateur avec le chemin de la nouvelle image
    user.profileImage = uploadedFile.filePath;
    return this.userRepository.save(user);
  }

  /**
   * DELETE PROFILE IMAGE - Supprimer l'image de profil
   */
  async deleteProfileImage(userId: string): Promise<User> {
    const user = await this.findOne(userId);

    if (user.profileImage) {
      await this.uploadService.deleteProfileImage(user.profileImage);
      user.profileImage = null;
      return this.userRepository.save(user);
    }

    return user;
  }

  /**
   * CHANGE PASSWORD - Changer le mot de passe (utilisateur connecté)
   */
  async changePassword(
    userId: string,
    input: ChangePasswordInput,
  ): Promise<boolean> {
    const user = await this.findOne(userId);

    if (!user.password) {
      throw new BadRequestException(
        'Compte connecté via Google, impossible de changer le mot de passe',
      );
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await bcrypt.compare(
      input.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(input.newPassword, 10);

    await this.userRepository.update(userId, {
      password: hashedPassword,
    });

    return true;
  }

  /**
   * CHANGE EMAIL - Changer l'email (nécessite vérification)
   */
  async changeEmail(
    userId: string,
    input: ChangeEmailInput,
  ): Promise<{ message: string; newEmail: string }> {
    const user = await this.findOne(userId);

    // Vérifier le mot de passe
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }
    }

    // Vérifier que le nouvel email n'existe pas déjà
    const emailExists = await this.findByEmail(input.newEmail);
    if (emailExists) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Mettre à jour l'email et marquer comme non vérifié
    user.email = input.newEmail;
    user.isEmailVerified = false;
    user.emailVerifiedAt = null;
    await this.userRepository.save(user);

    return {
      message: 'Email modifié. Un code de vérification a été envoyé.',
      newEmail: input.newEmail,
    };
  }

  /**
   * CHANGE ROLE - Changer le rôle (admin uniquement)
   */
  async changeRole(userId: string, roleId: string): Promise<User> {
    await this.findOne(userId);

    await this.userRepository.update(userId, {
      roleId,
    });

    return this.findOne(userId);
  }

  /**
   * TOGGLE ACTIVE STATUS - Activer/Désactiver un compte
   */
  async toggleActiveStatus(userId: string): Promise<User> {
    const user = await this.findOne(userId);

    await this.userRepository.update(userId, {
      isActive: !user.isActive,
    });

    return this.findOne(userId);
  }

  /**
   * DELETE - Supprimer un utilisateur
   */
  async remove(id: string): Promise<boolean> {
    const user = await this.findOne(id);

    // Supprimer l'image de profil si elle existe
    if (user.profileImage) {
      await this.uploadService.deleteProfileImage(user.profileImage);
    }

    await this.userRepository.remove(user);
    return true;
  }

  /**
   * ACTIONS - Vérifier l'email
   */
  async verifyEmail(userId: string): Promise<User> {
    const user = await this.findOne(userId);
    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    return this.userRepository.save(user);
  }

  /**
   * ACTIONS - Mettre à jour la dernière connexion
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  /**
   * STATISTICS - Statistiques des utilisateurs
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    verifiedEmails: number;
    unverifiedEmails: number;
    individualUsers: number;
    companyUsers: number;
  }> {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({
      where: { isActive: true },
    });
    const inactiveUsers = await this.userRepository.count({
      where: { isActive: false },
    });
    const verifiedEmails = await this.userRepository.count({
      where: { isEmailVerified: true },
    });
    const unverifiedEmails = await this.userRepository.count({
      where: { isEmailVerified: false },
    });
    const individualUsers = await this.userRepository.count({
      where: { userType: UserType.INDIVIDUAL },
    });
    const companyUsers = await this.userRepository.count({
      where: { userType: UserType.COMPANY },
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      verifiedEmails,
      unverifiedEmails,
      individualUsers,
      companyUsers,
    };
  }
}
