import { Injectable } from '@nestjs/common';
import { LigneReglementVignette } from '../entities/ligne-reglement.entity';
import { LigneReglementVignetteResource } from '../dto/ligne-reglement.resource';
import { CreateLigneReglementVignetteInput } from '../dto/create-ligne-reglement.input';
import { ModePaiementMapper } from '../../mode-paiement/mappers/mode-paiement.mapper';

@Injectable()
export class LigneReglementVignetteMapper {
  constructor(private readonly modePaiementMapper: ModePaiementMapper) {}

  toResource(
    entity: LigneReglementVignette,
  ): LigneReglementVignetteResource | null {
    if (!entity) return null;

    const resource = new LigneReglementVignetteResource();
    resource.id = entity.id;
    resource.vignetteId = entity.vignetteId;
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

    // ✅ Convertir les dates en string ISO pour éviter le conflit DateTime scalar
    resource.echeance = entity.echeance
      ? entity.echeance instanceof Date
        ? entity.echeance.toISOString().split('T')[0]
        : String(entity.echeance)
      : undefined;

    resource.referencePiece = entity.referencePiece;
    resource.banque = entity.banque;
    resource.porteur = entity.porteur;

    resource.dateOperation =
      entity.dateOperation instanceof Date
        ? entity.dateOperation.toISOString().split('T')[0]
        : String(entity.dateOperation);

    resource.createdAt = entity.createdAt;
    resource.estActif = entity.estActif;

    return resource;
  }

  toResourceList(
    entities: LigneReglementVignette[],
  ): LigneReglementVignetteResource[] {
    return entities
      .map((e) => this.toResource(e))
      .filter((r): r is LigneReglementVignetteResource => r !== null);
  }

  createInputToEntity(
    input: CreateLigneReglementVignetteInput,
    vignetteId: string,
  ): LigneReglementVignette {
    const entity = new LigneReglementVignette();
    entity.vignetteId = vignetteId;
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
