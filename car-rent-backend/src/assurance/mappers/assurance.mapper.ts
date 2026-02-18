import { Injectable } from '@nestjs/common';
import { Assurance } from '../entities/assurance.entity';
import { AssuranceResource } from '../dto/assurance.resource';
import { CreateAssuranceInput } from '../dto/create-assurance.input';
import { UpdateAssuranceInput } from '../dto/update-assurance.input';
import { VehiculeMapper } from '../../vehicule/mappers/vehicule.mapper';
import { AssuranceReglementMapper } from './assurance-reglement.mapper';

/**
 * Mapper pour Assurance
 */
@Injectable()
export class AssuranceMapper {
  constructor(
    private readonly vehiculeMapper: VehiculeMapper,
    private readonly assuranceReglementMapper: AssuranceReglementMapper,
  ) {}

  /**
   * Convertit une entité Assurance en Resource
   */
  toResource(entity: Assurance): AssuranceResource | null {
    if (!entity) {
      return null;
    }

    const resource = new AssuranceResource();
    resource.id = entity.id;
    resource.vehiculeId = entity.vehiculeId;

    const vehiculeResource = this.vehiculeMapper.toResource(entity.vehicule);
    if (!vehiculeResource) {
      throw new Error('Erreur lors de la conversion du véhicule en resource');
    }
    resource.vehicule = vehiculeResource;

    resource.prestataire = entity.prestataire;
    resource.dateDebut = entity.dateDebut;
    resource.dateFinValidite = entity.dateFinValidite;
    resource.montantTotal = Number(entity.montantTotal);
    resource.dateOperation = entity.dateOperation;
    resource.numeroPolice = entity.numeroPolice;
    resource.observations = entity.observations;
    resource.documentUrl = entity.documentUrl;

    // Mapper les règlements
    resource.reglements = entity.reglements
      ? this.assuranceReglementMapper.toResourceList(entity.reglements)
      : [];

    resource.saisiPar = entity.saisiPar;
    resource.modifiePar = entity.modifiePar;
    resource.saisiLe = entity.saisiLe;
    resource.modifieLe = entity.modifieLe;
    resource.estActif = entity.estActif;

    return resource;
  }

  /**
   * Convertit un tableau d'entités en tableau de Resources
   */
  toResourceList(entities: Assurance[]): AssuranceResource[] {
    return entities
      .map((entity) => this.toResource(entity))
      .filter((resource): resource is AssuranceResource => resource !== null);
  }

  /**
   * Convertit un CreateAssuranceInput en entité
   */
  createInputToEntity(input: CreateAssuranceInput): Assurance {
    const entity = new Assurance();
    entity.vehiculeId = input.vehiculeId;
    entity.prestataire = input.prestataire;
    entity.dateDebut = input.dateDebut;
    entity.dateFinValidite = input.dateFinValidite;
    entity.montantTotal = input.montantTotal;
    entity.dateOperation = input.dateOperation;
    entity.numeroPolice = input.numeroPolice;
    entity.observations = input.observations;
    entity.documentUrl = input.documentUrl ?? null;
    entity.saisiPar = input.saisiPar;

    return entity;
  }

  /**
   * Applique les modifications d'un UpdateAssuranceInput sur une entité
   */
  updateInputToEntity(
    entity: Assurance,
    input: UpdateAssuranceInput,
  ): Assurance {
    if (input.vehiculeId !== undefined) entity.vehiculeId = input.vehiculeId;
    if (input.prestataire !== undefined) entity.prestataire = input.prestataire;
    if (input.dateDebut !== undefined) entity.dateDebut = input.dateDebut;
    if (input.dateFinValidite !== undefined)
      entity.dateFinValidite = input.dateFinValidite;
    if (input.montantTotal !== undefined)
      entity.montantTotal = input.montantTotal;
    if (input.dateOperation !== undefined)
      entity.dateOperation = input.dateOperation;
    if (input.numeroPolice !== undefined)
      entity.numeroPolice = input.numeroPolice;
    if (input.observations !== undefined)
      entity.observations = input.observations;
    if (input.documentUrl !== undefined)
      entity.documentUrl = input.documentUrl ?? null;
    if (input.modifiePar !== undefined) entity.modifiePar = input.modifiePar;

    return entity;
  }
}
