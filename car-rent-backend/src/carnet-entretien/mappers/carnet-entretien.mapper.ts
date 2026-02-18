import { Injectable } from '@nestjs/common';
import { CarnetEntretien } from '../entities/carnet-entretien.entity';
import { CarnetEntretienResource } from '../dto/carnet-entretien.resource';
import { UpdateCarnetEntretienInput } from '../dto/update-carnet-entretien.input';

@Injectable()
export class CarnetEntretienMapper {
  /**
   * Convertir Entity → Resource
   */
  toResource(entity: CarnetEntretien): CarnetEntretienResource | null {
    if (!entity) return null;

    const resource = new CarnetEntretienResource();
    resource.id = entity.id;
    resource.vehiculeId = entity.vehiculeId;
    resource.vehiculeMatricule = entity.vehicule?.matricule || '';
    resource.typeEntretienId = entity.typeEntretienId;
    resource.codeEntretien = entity.typeEntretien?.codeEntretien || '';
    resource.designation = entity.typeEntretien?.designation || '';
    resource.dateDebut = entity.dateDebut;
    resource.dateFin = entity.dateFin;
    resource.kilometrageDebut = entity.kilometrageDebut;
    resource.kilometrageFin = entity.kilometrageFin;
    resource.coutEstime = Number(entity.coutEstime);
    resource.coutReel = entity.coutReel ? Number(entity.coutReel) : null;
    resource.notes = entity.notes;
    resource.statut = entity.statut;
    resource.saisiPar = entity.saisiPar;
    resource.modifiePar = entity.modifiePar;
    resource.saisiLe = entity.saisiLe;
    resource.modifieLe = entity.modifieLe;

    return resource;
  }

  toResourceList(entities: CarnetEntretien[]): CarnetEntretienResource[] {
    return entities
      .map((e) => this.toResource(e))
      .filter((r): r is CarnetEntretienResource => r !== null);
  }

  /**
   * Appliquer les modifications Update
   */
  updateInputToEntity(
    entity: CarnetEntretien,
    input: UpdateCarnetEntretienInput,
  ): CarnetEntretien {
    if (input.dateFin !== undefined) entity.dateFin = input.dateFin;
    if (input.kilometrageFin !== undefined)
      entity.kilometrageFin = input.kilometrageFin;
    if (input.coutReel !== undefined) entity.coutReel = input.coutReel;
    if (input.notes !== undefined) entity.notes = input.notes;
    if (input.statut !== undefined) entity.statut = input.statut;
    if (input.modifiePar !== undefined) entity.modifiePar = input.modifiePar;

    return entity;
  }
}
