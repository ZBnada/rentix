import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { RoleResource } from './dto/resources/role.resource';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { RoleMapper } from './mappers/role.mapper';

@Resolver(() => RoleResource)
export class RoleResolver {
  constructor(
    private readonly roleService: RoleService,
    private readonly roleMapper: RoleMapper,
  ) {}

  @Mutation(() => RoleResource, {
    description: 'Créer un nouveau rôle - Réservé au SUPERADMIN',
  })
  async createRole(
    @Args('createRoleInput') input: CreateRoleInput,
  ): Promise<RoleResource> {
    const role = await this.roleService.create(input);
    const resource = this.roleMapper.toResource(role);

    if (!resource) {
      throw new Error('Erreur lors de la création du rôle');
    }

    return resource;
  }

  @Query(() => [RoleResource], {
    name: 'roles',
    description: 'Récupérer tous les rôles triés par poids',
  })
  async findAllRoles(): Promise<RoleResource[]> {
    const roles = await this.roleService.findAll();
    return this.roleMapper.toResourceArray(roles);
  }

  @Query(() => RoleResource, {
    name: 'role',
    description: 'Récupérer un rôle par son ID',
  })
  async findRole(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<RoleResource> {
    const role = await this.roleService.findOne(id);
    const resource = this.roleMapper.toResource(role);

    if (!resource) {
      throw new Error(`Rôle avec l'ID "${id}" introuvable`);
    }

    return resource;
  }

  @Query(() => RoleResource, {
    name: 'roleByName',
    description: 'Récupérer un rôle par son nom',
    nullable: true,
  })
  async findRoleByName(
    @Args('name', { type: () => String }) name: string,
  ): Promise<RoleResource | null> {
    const role = await this.roleService.findByName(name);
    return this.roleMapper.toResource(role);
  }

  @Query(() => [RoleResource], {
    name: 'rolesByMaxWeight',
    description: 'Récupérer rôles avec poids <= maxWeight',
  })
  async findRolesByMaxWeight(
    @Args('maxWeight', { type: () => Int }) maxWeight: number,
  ): Promise<RoleResource[]> {
    const roles = await this.roleService.findByMaxWeight(maxWeight);
    return this.roleMapper.toResourceArray(roles);
  }

  @Mutation(() => RoleResource, {
    description: 'Mettre à jour un rôle - Réservé au SUPERADMIN',
  })
  async updateRole(
    @Args('updateRoleInput') input: UpdateRoleInput,
  ): Promise<RoleResource> {
    const role = await this.roleService.update(input);
    const resource = this.roleMapper.toResource(role);

    if (!resource) {
      throw new Error('Erreur lors de la mise à jour du rôle');
    }

    return resource;
  }

  @Mutation(() => Boolean, {
    description: 'Supprimer un rôle - Réservé au SUPERADMIN',
  })
  async removeRole(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.roleService.remove(id);
  }

  @Query(() => Boolean, {
    name: 'roleHasMorePrivileges',
    description: 'Vérifier si roleId1 a plus de privilèges que roleId2',
  })
  async compareRoles(
    @Args('roleId1', { type: () => ID }) roleId1: string,
    @Args('roleId2', { type: () => ID }) roleId2: string,
  ): Promise<boolean> {
    return this.roleService.hasMorePrivileges(roleId1, roleId2);
  }

  @Query(() => Boolean, {
    name: 'hasRequiredPrivilegeLevel',
    description: 'Vérifier si un rôle a le niveau de privilège requis',
  })
  async checkPrivilegeLevel(
    @Args('roleId', { type: () => ID }) roleId: string,
    @Args('requiredWeight', { type: () => Int }) requiredWeight: number,
  ): Promise<boolean> {
    return this.roleService.hasRequiredPrivilegeLevel(roleId, requiredWeight);
  }
}
