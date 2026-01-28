import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { RoleResource } from '../dto/resources/role.resource';

@Injectable()
export class RoleMapper {
  /**
   * Transforme une entité Role en RoleResource pour GraphQL
   */
  toResource(entity: Role | null): RoleResource | null {
    if (!entity) {
      return null;
    }

    const resource = new RoleResource();
    resource.id = entity.id;
    resource.name = entity.name;
    resource.description = entity.description;
    resource.weight = entity.weight;
    resource.createdAt = entity.createdAt;
    resource.updatedAt = entity.updatedAt;

    return resource;
  }

  /**
   * Transforme un tableau d'entités Role en tableau de RoleResource
   */
  toResourceArray(entities: Role[]): RoleResource[] {
    return entities
      .map((entity) => this.toResource(entity))
      .filter((resource): resource is RoleResource => resource !== null);
  }
}
