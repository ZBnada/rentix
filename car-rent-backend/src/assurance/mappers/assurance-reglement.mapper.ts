import { Injectable } from '@nestjs/common';
import { AssuranceReglement } from '../entities/assurance-reglement.entity';
import { AssuranceReglementResource } from '../dto/assurance-reglement.resource';
import { CreateAssuranceReglementInput } from '../dto/create-assurance-reglement.input';
import { ModePaiementMapper } from '../../mode-paiement/mappers/mode-paiement.mapper';

/**
 * Mapper pour AssuranceReglement
 */
@Injectable()
export class AssuranceReglementMapper {
  constructor(private readonly modePaiementMapper: ModePaiementMapper) {}

  /**
   * Convertit une entité AssuranceReglement en Resource
   */
  toResource(entity: AssuranceReglement): AssuranceReglementResource | null {
    if (!entity) {
      return null;
    }

    const resource = new AssuranceReglementResource();
    resource.id = entity.id;
    resource.assuranceId = entity.assuranceId;
    resource.modePaiementId = entity.modePaiementId;

    const modePaiementResource = this.modePaiementMapper.toResource(
      entity.modePaiement,
    );
    if (!modePaiementResource) {
      throw new Error(
        'Erreur lors de la conversion du mode de paiement en resource',
      );
    }
    resource.modePaiement = modePaiementResource;

    resource.designation = entity.designation;
    resource.montant = Number(entity.montant);
    resource.echeance = entity.echeance;
    resource.referencePiece = entity.referencePiece;
    resource.banque = entity.banque;
    resource.porteur = entity.porteur;
    resource.dateOperation = entity.dateOperation;
    resource.createdAt = entity.createdAt;
    resource.estActif = entity.estActif;

    return resource;
  }

  /**
   * Convertit un tableau d'entités en tableau de Resources
   */
  toResourceList(entities: AssuranceReglement[]): AssuranceReglementResource[] {
    return entities
      .map((entity) => this.toResource(entity))
      .filter(
        (resource): resource is AssuranceReglementResource => resource !== null,
      );
  }

  /**
   * Convertit un CreateAssuranceReglementInput en entité
   */
  createInputToEntity(
    input: CreateAssuranceReglementInput,
    assuranceId: string,
  ): AssuranceReglement {
    const entity = new AssuranceReglement();
    entity.assuranceId = assuranceId;
    entity.modePaiementId = input.modePaiementId;
    entity.designation = input.designation;
    entity.montant = input.montant;
    entity.echeance = input.echeance;
    entity.referencePiece = input.referencePiece;
    entity.banque = input.banque;
    entity.porteur = input.porteur;
    entity.dateOperation = input.dateOperation;

    return entity;
  }
}
