import { Injectable } from '@nestjs/common';
import { ModePaiementEntity } from '../entities/mode-paiement.entity';
import { ModePaiementResource } from '../dto/mode-paiement.resource';
import { CreateModePaiementInput } from '../dto/create-mode-paiement.input';
import { UpdateModePaiementInput } from '../dto/update-mode-paiement.input';

/**
 * Mapper pour la conversion entre Entity et Resource/Input
 */
@Injectable()
export class ModePaiementMapper {
  /**
   * Convertit une entité ModePaiementEntity en Resource GraphQL
   */
  toResource(entity: ModePaiementEntity): ModePaiementResource | null {
    if (!entity) {
      return null;
    }

    const resource = new ModePaiementResource();
    resource.id = entity.id;
    resource.type = entity.type;
    resource.libelle = entity.libelle;
    resource.description = entity.description;
    resource.icon = entity.icon;
    resource.estActif = entity.estActif;
    resource.createdAt = entity.createdAt;
    resource.updatedAt = entity.updatedAt;

    return resource;
  }

  /**
   * Convertit un tableau d'entités en tableau de Resources
   */
  toResourceList(entities: ModePaiementEntity[]): ModePaiementResource[] {
    return entities
      .map((entity) => this.toResource(entity))
      .filter(
        (resource): resource is ModePaiementResource => resource !== null,
      );
  }

  /**
   * Convertit un CreateModePaiementInput en entité ModePaiementEntity
   */
  createInputToEntity(input: CreateModePaiementInput): ModePaiementEntity {
    const entity = new ModePaiementEntity();

    // Si un ID est fourni (pour les données pré-définies), on l'utilise
    if (input.id) {
      entity.id = input.id;
    }

    entity.type = input.type;
    entity.libelle = input.libelle;
    entity.description = input.description;
    entity.icon = input.icon;

    return entity;
  }

  /**
   * Applique les modifications d'un UpdateModePaiementInput sur une entité existante
   */
  updateInputToEntity(
    entity: ModePaiementEntity,
    input: UpdateModePaiementInput,
  ): ModePaiementEntity {
    if (input.type !== undefined) entity.type = input.type;
    if (input.libelle !== undefined) entity.libelle = input.libelle;
    if (input.description !== undefined) entity.description = input.description;
    if (input.icon !== undefined) entity.icon = input.icon;

    return entity;
  }
}
