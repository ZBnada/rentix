import { Injectable } from '@nestjs/common';
import { Vignette } from '../entities/vignette.entity';
import { VignetteResource } from '../dto/vignette.resource';
import { CreateVignetteInput } from '../dto/create-vignette.input';
import { UpdateVignetteInput } from '../dto/update-vignette.input';
import { VehiculeMapper } from '../../vehicule/mappers/vehicule.mapper';
import { LigneReglementVignetteMapper } from './Ligne-reglement-vignette.mapper';

@Injectable()
export class VignetteMapper {
  constructor(
    private readonly vehiculeMapper: VehiculeMapper,
    private readonly ligneReglementMapper: LigneReglementVignetteMapper,
  ) {}

  /**
   * Convertit une date MySQL (string ou Date) en string YYYY-MM-DD
   */
  private toDateString(value: Date | string | undefined): string {
    if (!value) return '';
    if (value instanceof Date) return value.toISOString().split('T')[0];
    return String(value).split('T')[0];
  }

  toResource(entity: Vignette): VignetteResource | null {
    if (!entity) return null;

    const resource = new VignetteResource();
    resource.id = entity.id;
    resource.vehiculeId = entity.vehiculeId;

    const vehiculeResource = this.vehiculeMapper.toResource(entity.vehicule);
    if (!vehiculeResource) {
      throw new Error('Erreur lors de la conversion du véhicule en resource');
    }
    resource.vehicule = vehiculeResource;

    resource.matriculeVehicule = entity.matriculeVehicule;

    // ✅ Convertir les colonnes type 'date' en string
    resource.dateFinValidite = this.toDateString(entity.dateFinValidite);
    resource.dateOperation = this.toDateString(entity.dateOperation);

    resource.montant = Number(entity.montant);
    resource.montantReste = Number(entity.montantReste);
    resource.numeroFiche = entity.numeroFiche;
    resource.statut = entity.statut;

    resource.lignesReglement = entity.lignesReglement
      ? this.ligneReglementMapper.toResourceList(entity.lignesReglement)
      : [];

    resource.saisiPar = entity.saisiPar;
    resource.modifiePar = entity.modifiePar;

    // ✅ CreateDateColumn/UpdateDateColumn retournent de vrais objets Date
    resource.saisiLe = entity.saisiLe;
    resource.modifieLe = entity.modifieLe;

    resource.estActif = entity.estActif;

    return resource;
  }

  toResourceList(entities: Vignette[]): VignetteResource[] {
    return entities
      .map((e) => this.toResource(e))
      .filter((r): r is VignetteResource => r !== null);
  }

  createInputToEntity(
    input: CreateVignetteInput,
    matriculeVehicule: string,
  ): Vignette {
    const entity = new Vignette();
    entity.vehiculeId = input.vehiculeId;
    entity.matriculeVehicule = matriculeVehicule;
    entity.dateFinValidite = input.dateFinValidite;
    entity.montant = input.montant;
    entity.montantReste = input.montant;
    entity.dateOperation = input.dateOperation;
    entity.saisiPar = input.saisiPar;
    return entity;
  }

  updateInputToEntity(entity: Vignette, input: UpdateVignetteInput): Vignette {
    if (input.vehiculeId !== undefined) entity.vehiculeId = input.vehiculeId;
    if (input.dateFinValidite !== undefined)
      entity.dateFinValidite = input.dateFinValidite;
    if (input.montant !== undefined) entity.montant = input.montant;
    if (input.dateOperation !== undefined)
      entity.dateOperation = input.dateOperation;
    if (input.modifiePar !== undefined) entity.modifiePar = input.modifiePar;
    return entity;
  }
}
