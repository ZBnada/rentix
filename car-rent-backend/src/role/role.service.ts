import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * CREATE - Créer un nouveau rôle (réservé au SUPERADMIN)
   */
  async create(input: CreateRoleInput): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { name: input.name },
    });

    if (existingRole) {
      throw new ConflictException(
        `Un rôle avec le nom "${input.name}" existe déjà`,
      );
    }

    const role = this.roleRepository.create(input);
    return this.roleRepository.save(role);
  }

  /**
   * READ - Récupérer tous les rôles triés par poids (du plus privilégié au moins)
   */
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      order: { weight: 'ASC' },
    });
  }

  /**
   * READ - Récupérer un rôle par ID
   */
  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Rôle avec l'ID "${id}" introuvable`);
    }

    return role;
  }

  /**
   * READ - Récupérer un rôle par son nom
   */
  async findByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { name },
    });

    if (!role) {
      throw new NotFoundException(`Rôle avec le nom "${name}" introuvable`);
    }

    return role;
  }

  /**
   * READ - Récupérer tous les rôles avec poids <= maxWeight
   */
  async findByMaxWeight(maxWeight: number): Promise<Role[]> {
    return this.roleRepository
      .createQueryBuilder('role')
      .where('role.weight <= :maxWeight', { maxWeight })
      .orderBy('role.weight', 'ASC')
      .getMany();
  }

  /**
   * UPDATE - Mettre à jour un rôle (réservé au SUPERADMIN)
   */
  async update(input: UpdateRoleInput): Promise<Role> {
    const role = await this.findOne(input.id);

    if (input.name && input.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: input.name },
      });

      if (existingRole) {
        throw new ConflictException(
          `Un rôle avec le nom "${input.name}" existe déjà`,
        );
      }
    }

    Object.assign(role, input);
    return this.roleRepository.save(role);
  }

  /**
   * DELETE - Supprimer un rôle (réservé au SUPERADMIN)
   */
  async remove(id: string): Promise<boolean> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!role) {
      throw new NotFoundException(`Rôle avec l'ID "${id}" introuvable`);
    }

    if (role.users && role.users.length > 0) {
      throw new BadRequestException(
        `Impossible de supprimer ce rôle car ${role.users.length} utilisateur(s) l'utilisent`,
      );
    }

    await this.roleRepository.remove(role);
    return true;
  }

  /**
   * UTILITY - Comparer deux rôles par leur poids
   */
  async hasMorePrivileges(roleId1: string, roleId2: string): Promise<boolean> {
    const role1 = await this.findOne(roleId1);
    const role2 = await this.findOne(roleId2);
    return role1.weight < role2.weight;
  }

  /**
   * UTILITY - Vérifier si un rôle a le niveau de privilège requis
   */
  async hasRequiredPrivilegeLevel(
    roleId: string,
    requiredWeight: number,
  ): Promise<boolean> {
    const role = await this.findOne(roleId);
    return role.weight <= requiredWeight;
  }
}
