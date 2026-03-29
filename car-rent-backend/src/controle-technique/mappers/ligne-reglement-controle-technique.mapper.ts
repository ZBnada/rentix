import { Injectable } from '@nestjs/common';
import { LigneReglementControleTechnique } from '../entities/ligne-reglement-controle-technique.entity';
import { LigneReglementControleTechniqueResource } from '../dto/ligne-reglement-controle-technique.resource';
import { ModePaiementMapper } from '../../mode-paiement/mappers/mode-paiement.mapper';

@Injectable()
export class LigneReglementControleTechniqueMapper {
  constructor(private readonly modePaiementMapper: ModePaiementMapper) {}

  toResource(
    entity: LigneReglementControleTechnique,
  ): LigneReglementControleTechniqueResource | null {
    if (!entity) return null;

    const resource = new LigneReglementControleTechniqueResource();
    resource.id = entity.id;
    resource.controleTechniqueId = entity.controleTechniqueId;
    resource.modePaiementId = entity.modePaiementId;

    // ✅ toResource() — même pattern que vignette mapper
    const modePaiementResource = this.modePaiementMapper.toResource(
      entity.modePaiement,
    );
    if (!modePaiementResource)
      throw new Error('Erreur conversion mode paiement');
    resource.modePaiement = modePaiementResource;

    resource.designation = entity.designation;
    resource.montant = Number(entity.montant);
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
    return resource;
  }

  toResourceList(
    entities: LigneReglementControleTechnique[],
  ): LigneReglementControleTechniqueResource[] {
    return entities
      .map((e) => this.toResource(e))
      .filter((r): r is LigneReglementControleTechniqueResource => r !== null);
  }
}
