import { Injectable } from '@nestjs/common';
import { ControleTechnique } from '../entities/controle-technique.entity';
import { ControleTechniqueResource } from '../dto/controle-technique.resource';
import { CreateControleTechniqueInput } from '../dto/create-controle-technique.input';
import { VehiculeMapper } from '../../vehicule/mappers/vehicule.mapper';
import { LigneReglementControleTechniqueMapper } from './ligne-reglement-controle-technique.mapper';

@Injectable()
export class ControleTechniqueMapper {
  constructor(
    private readonly vehiculeMapper: VehiculeMapper,
    private readonly ligneMapper: LigneReglementControleTechniqueMapper,
  ) {}

  private toDateString(value: Date | string | undefined): string {
    if (!value) return '';
    if (value instanceof Date) return value.toISOString().split('T')[0];
    return String(value).split('T')[0];
  }

  toResource(entity: ControleTechnique): ControleTechniqueResource | null {
    if (!entity) return null;

    const resource = new ControleTechniqueResource();
    resource.id = entity.id;
    resource.vehiculeId = entity.vehiculeId;

    // ✅ toResource() — même pattern que vignette mapper
    const vehiculeResource = this.vehiculeMapper.toResource(entity.vehicule);
    if (!vehiculeResource) throw new Error('Erreur conversion véhicule');
    resource.vehicule = vehiculeResource;

    resource.matriculeVehicule = entity.matriculeVehicule;
    resource.numeroFiche = entity.numeroFiche;
    resource.dateFinValidite = this.toDateString(entity.dateFinValidite);
    resource.montant = Number(entity.montant);
    resource.montantReste = Number(entity.montantReste);
    resource.dateOperation = this.toDateString(entity.dateOperation);
    resource.statut = entity.statut;
    resource.lignesReglement = entity.lignesReglement
      ? this.ligneMapper.toResourceList(entity.lignesReglement)
      : [];
    resource.saisiPar = entity.saisiPar;
    resource.modifiePar = entity.modifiePar;
    resource.validePar = entity.validePar;
    resource.annulePar = entity.annulePar;
    resource.saisiLe = entity.saisiLe;
    resource.modifieLe = entity.modifieLe;
    return resource;
  }

  toResourceList(entities: ControleTechnique[]): ControleTechniqueResource[] {
    return entities
      .map((e) => this.toResource(e))
      .filter((r): r is ControleTechniqueResource => r !== null);
  }

  createInputToEntity(
    input: CreateControleTechniqueInput,
    matriculeVehicule: string,
  ): ControleTechnique {
    const entity = new ControleTechnique();
    entity.vehiculeId = input.vehiculeId;
    entity.matriculeVehicule = matriculeVehicule;
    entity.dateFinValidite = input.dateFinValidite;
    entity.montant = input.montant;
    entity.montantReste = input.montant;
    entity.dateOperation = input.dateOperation;
    entity.saisiPar = input.saisiPar ?? '';
    return entity;
  }
}
