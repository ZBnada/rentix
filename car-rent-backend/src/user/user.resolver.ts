// src/user/user.resolver.ts

import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResource } from './dto/resources/user.resource';
import {
  UserPaginatedResponse,
  UserStatsResponse,
} from './dto/user-paginated.response';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserFilterInput } from './dto/user-filter.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { ChangeEmailInput } from './dto/change-email.input';
import { ChangeRoleInput } from './dto/change-role.input';
import { UserMapper } from './mappers/user.mapper';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => UserResource)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  /**
   * QUERY - Liste des utilisateurs avec filtres et pagination
   */
  @Query(() => UserPaginatedResponse, {
    name: 'users',
    description:
      'Liste des utilisateurs avec filtrage, recherche et pagination',
  })
  async findAllUsers(
    @Args('filter', { nullable: true }) filter?: UserFilterInput,
  ): Promise<UserPaginatedResponse> {
    const filterInput = filter || {};
    const { users, total } =
      await this.userService.findAllWithFilters(filterInput);

    const page = filterInput.page || 1;
    const limit = filterInput.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      users: this.userMapper.toResourceArray(users),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  /**
   * QUERY - Un utilisateur par ID
   */
  @Query(() => UserResource, { name: 'user' })
  async findUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<UserResource> {
    const user = await this.userService.findOne(id);
    const resource = this.userMapper.toResource(user);
    if (!resource) throw new Error(`Utilisateur ${id} introuvable`);
    return resource;
  }

  /**
   * QUERY - Profil de l'utilisateur connecté
   */
  @UseGuards(GqlAuthGuard)
  @Query(() => UserResource, { name: 'me' })
  async getMe(@Context() context: any): Promise<UserResource> {
    const userId = context.req.user?.id || context.req.user?.sub;

    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new Error('Utilisateur introuvable');
    }

    if (!user.isActive) {
      throw new Error('Compte inactif');
    }

    const resource = this.userMapper.toResource(user);
    if (!resource) throw new Error('Erreur lors de la récupération du profil');

    return resource;
  }
  /**
   * QUERY - Statistiques des utilisateurs
   */
  @Query(() => UserStatsResponse, { name: 'userStats' })
  async getUserStats(): Promise<UserStatsResponse> {
    return this.userService.getUserStats();
  }

  /**
   * MUTATION - Créer un utilisateur (Admin)
   */
  @Mutation(() => UserResource)
  async createUser(
    @Args('createUserInput') input: CreateUserInput,
  ): Promise<UserResource> {
    const user = await this.userService.create(input);
    const resource = this.userMapper.toResource(user);
    if (!resource) throw new Error('Erreur lors de la création');
    return resource;
  }

  /**
   * MUTATION - Mettre à jour un utilisateur
   */
  @Mutation(() => UserResource)
  async updateUser(
    @Args('updateUserInput') input: UpdateUserInput,
  ): Promise<UserResource> {
    // Vérifier que l'id est fourni
    if (!input.id) {
      throw new Error("L'ID de l'utilisateur est requis pour la mise à jour");
    }

    const user = await this.userService.update(input.id, input);
    const resource = this.userMapper.toResource(user);
    if (!resource) throw new Error('Erreur lors de la mise à jour');
    return resource;
  }

  /**
   * MUTATION - Changer le mot de passe (utilisateur connecté)
   */
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, {
    description: "Changer le mot de passe de l'utilisateur connecté",
  })
  async changePassword(
    @Context() context: any,
    @Args('changePasswordInput') input: ChangePasswordInput,
  ): Promise<boolean> {
    const userId = context.req.user.id;
    return this.userService.changePassword(userId, input);
  }

  /**
   * MUTATION - Changer l'email (utilisateur connecté)
   */
  @UseGuards(GqlAuthGuard)
  @Mutation(() => String, {
    description: "Changer l'email de l'utilisateur connecté",
  })
  async changeEmail(
    @Context() context: any,
    @Args('changeEmailInput') input: ChangeEmailInput,
  ): Promise<string> {
    const userId = context.req.user.id;
    const result = await this.userService.changeEmail(userId, input);
    return result.message;
  }

  /**
   * MUTATION - Changer le rôle (Admin uniquement)
   */
  @Mutation(() => UserResource, {
    description: "Changer le rôle d'un utilisateur (Admin)",
  })
  async changeUserRole(
    @Args('changeRoleInput') input: ChangeRoleInput,
  ): Promise<UserResource> {
    const user = await this.userService.changeRole(input.userId, input.roleId);
    const resource = this.userMapper.toResource(user);
    if (!resource) throw new Error('Erreur lors du changement de rôle');
    return resource;
  }

  /**
   * MUTATION - Activer/Désactiver un compte (Admin)
   */
  @Mutation(() => UserResource, {
    description: 'Activer ou désactiver un compte utilisateur',
  })
  async toggleUserStatus(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<UserResource> {
    const user = await this.userService.toggleActiveStatus(userId);
    const resource = this.userMapper.toResource(user);
    if (!resource) throw new Error('Erreur lors du changement de statut');
    return resource;
  }

  /**
   * MUTATION - Supprimer un utilisateur
   */
  @Mutation(() => Boolean)
  async removeUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.userService.remove(id);
  }
}
