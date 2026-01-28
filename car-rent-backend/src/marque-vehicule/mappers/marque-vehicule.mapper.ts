import { Injectable } from '@nestjs/common';
import { MarqueVehicule } from '../entities/marque-vehicule.entity';
import { MarqueVehiculeResource } from '../dto/marque-vehicule.resource';
import { CreateMarqueVehiculeInput } from '../dto/create-marque-vehicule.input';
import { UpdateMarqueVehiculeInput } from '../dto/update-marque-vehicule.input';

/**
 * Mapper pour la conversion entre Entity et Resource/Input
 */
@Injectable()
export class MarqueVehiculeMapper {
  /**
   * Convertit une entité MarqueVehicule en Resource GraphQL
   */
  toResource(entity: MarqueVehicule): MarqueVehiculeResource | null {
    if (!entity) {
      return null;
    }

    const resource = new MarqueVehiculeResource();
    resource.id = entity.id;
    resource.libelle = entity.libelle;
    resource.logoUrl = entity.logoUrl;
    resource.description = entity.description;
    resource.createdAt = entity.createdAt;
    resource.updatedAt = entity.updatedAt;
    resource.estActif = entity.estActif;

    return resource;
  }

  /**
   * Convertit un tableau d'entités en tableau de Resources
   */
  toResourceList(entities: MarqueVehicule[]): MarqueVehiculeResource[] {
    return entities
      .map((entity) => this.toResource(entity))
      .filter(
        (resource): resource is MarqueVehiculeResource => resource !== null,
      );
  }

  /**
   * Convertit un CreateMarqueVehiculeInput en entité MarqueVehicule
   */
  createInputToEntity(input: CreateMarqueVehiculeInput): MarqueVehicule {
    const entity = new MarqueVehicule();

    // Si un ID est fourni (pour les données pré-définies), on l'utilise
    if (input.id) {
      entity.id = input.id;
    }

    entity.libelle = input.libelle;
    entity.logoUrl = input.logoUrl;
    entity.description = input.description;

    return entity;
  }

  /**
   * Applique les modifications d'un UpdateMarqueVehiculeInput sur une entité existante
   */
  updateInputToEntity(
    entity: MarqueVehicule,
    input: UpdateMarqueVehiculeInput,
  ): MarqueVehicule {
    if (input.libelle !== undefined) entity.libelle = input.libelle;
    if (input.logoUrl !== undefined) entity.logoUrl = input.logoUrl;
    if (input.description !== undefined) entity.description = input.description;

    return entity;
  }
}
