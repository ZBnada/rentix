import { Injectable } from '@nestjs/common';
import { TypeEntretien } from '../entities/type-entretien.entity';
import { TypeEntretienResource } from '../dto/type-entretien.resource';
import { CreateTypeEntretienInput } from '../dto/create-type-entretien.input';
import { UpdateTypeEntretienInput } from '../dto/update-type-entretien.input';

/**
 * Mapper pour TypeEntretien
 * Gère la conversion entre Entity, Resource et Input
 */
@Injectable()
export class TypeEntretienMapper {
  /**
   * Convertir une entité en Resource GraphQL
   */
  toResource(entity: TypeEntretien): TypeEntretienResource | null {
    if (!entity) {
      return null;
    }

    const resource = new TypeEntretienResource();
    resource.id = entity.id;
    resource.codeEntretien = entity.codeEntretien;
    resource.designation = entity.designation;
    resource.description = entity.description;
    resource.frequenceJoursRecommandee = entity.frequenceJoursRecommandee;
    resource.frequenceKmRecommandee = entity.frequenceKmRecommandee;
    resource.coutMoyenEstime = entity.coutMoyenEstime;
    resource.estObligatoire = entity.estObligatoire;
    resource.saisiPar = entity.saisiPar;
    resource.modifiePar = entity.modifiePar;
    resource.saisiLe = entity.saisiLe;
    resource.modifieLe = entity.modifieLe;
    resource.estActif = entity.estActif;

    return resource;
  }

  /**
   * Convertir une liste d'entités en liste de Resources
   */
  toResourceList(entities: TypeEntretien[]): TypeEntretienResource[] {
    return entities
      .map((entity) => this.toResource(entity))
      .filter(
        (resource): resource is TypeEntretienResource => resource !== null,
      );
  }

  /**
   * Convertir un CreateInput en entité
   */
  createInputToEntity(input: CreateTypeEntretienInput): TypeEntretien {
    const entity = new TypeEntretien();
    entity.codeEntretien = input.codeEntretien;
    entity.designation = input.designation;
    entity.description = input.description || null;
    entity.frequenceJoursRecommandee = input.frequenceJoursRecommandee || null;
    entity.frequenceKmRecommandee = input.frequenceKmRecommandee || null;
    entity.coutMoyenEstime = input.coutMoyenEstime || 0;
    entity.estObligatoire = input.estObligatoire || false;
    entity.estActif = true;

    return entity;
  }

  /**
   * Mettre à jour une entité à partir d'un UpdateInput
   */
  updateInputToEntity(
    existingEntity: TypeEntretien,
    input: UpdateTypeEntretienInput,
  ): TypeEntretien {
    if (input.codeEntretien !== undefined) {
      existingEntity.codeEntretien = input.codeEntretien;
    }
    if (input.designation !== undefined) {
      existingEntity.designation = input.designation;
    }
    if (input.description !== undefined) {
      existingEntity.description = input.description;
    }
    if (input.frequenceJoursRecommandee !== undefined) {
      existingEntity.frequenceJoursRecommandee =
        input.frequenceJoursRecommandee;
    }
    if (input.frequenceKmRecommandee !== undefined) {
      existingEntity.frequenceKmRecommandee = input.frequenceKmRecommandee;
    }
    if (input.coutMoyenEstime !== undefined) {
      existingEntity.coutMoyenEstime = input.coutMoyenEstime;
    }
    if (input.estObligatoire !== undefined) {
      existingEntity.estObligatoire = input.estObligatoire;
    }

    return existingEntity;
  }
}
