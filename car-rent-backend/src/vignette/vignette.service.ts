import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Vignette } from './entities/vignette.entity';
import { LigneReglementVignette } from './entities/ligne-reglement.entity';
import { CreateVignetteInput } from './dto/create-vignette.input';
import { UpdateVignetteInput } from './dto/update-vignette.input';
import { VignetteMapper } from './mappers/vignette.mapper';
import { LigneReglementVignetteMapper } from './mappers/Ligne-reglement-vignette.mapper';
import { VignetteResource } from './dto/vignette.resource';
import { VehiculeService } from '../vehicule/vehicule.service';
import { StatutVignette } from './enums/statut-vignette.enum';

@Injectable()
export class VignetteService {
  constructor(
    @InjectRepository(Vignette)
    private readonly vignetteRepository: Repository<Vignette>,
    @InjectRepository(LigneReglementVignette)
    private readonly ligneRepository: Repository<LigneReglementVignette>,
    private readonly vignetteMapper: VignetteMapper,
    private readonly ligneMapper: LigneReglementVignetteMapper,
    private readonly vehiculeService: VehiculeService,
    private readonly dataSource: DataSource,
  ) {}

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async findEntityById(id: string): Promise<Vignette> {
    const entity = await this.vignetteRepository.findOne({
      where: { id, estActif: true },
      relations: [
        'vehicule',
        'vehicule.marque',
        'lignesReglement',
        'lignesReglement.modePaiement',
      ],
    });
    if (!entity)
      throw new NotFoundException(`Vignette avec l'ID "${id}" introuvable`);
    return entity;
  }

  private calculerMontantReste(
    montant: number,
    lignes: LigneReglementVignette[],
  ): number {
    const total = lignes.reduce((sum, l) => sum + Number(l.montant), 0);
    return Math.max(0, montant - total);
  }

  // ─── Création ─────────────────────────────────────────────────────────────

  async createVignette(input: CreateVignetteInput): Promise<VignetteResource> {
    console.log(
      '🔵 createVignette - Input reçu:',
      JSON.stringify(input, null, 2),
    );

    const vehiculeResource = await this.vehiculeService.findVehiculeById(
      input.vehiculeId,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Créer la vignette
      const vignetteEntity = this.vignetteMapper.createInputToEntity(
        input,
        vehiculeResource.matricule,
      );
      const savedVignette = await queryRunner.manager.save(
        Vignette,
        vignetteEntity,
      );
      console.log('🔵 Vignette sauvegardée:', savedVignette.id);

      // Créer les lignes de règlement
      const ligneEntities = input.lignesReglement.map((ligneInput) =>
        this.ligneMapper.createInputToEntity(ligneInput, savedVignette.id),
      );
      await queryRunner.manager.save(LigneReglementVignette, ligneEntities);
      console.log('🔵 Lignes sauvegardées:', ligneEntities.length);

      // Calculer montant reste
      savedVignette.montantReste = this.calculerMontantReste(
        input.montant,
        ligneEntities,
      );
      await queryRunner.manager.save(Vignette, savedVignette);

      await queryRunner.commitTransaction();

      const vignetteWithRelations = await this.vignetteRepository.findOne({
        where: { id: savedVignette.id },
        relations: [
          'vehicule',
          'vehicule.marque',
          'lignesReglement',
          'lignesReglement.modePaiement',
        ],
      });

      if (!vignetteWithRelations)
        throw new Error('Erreur lors de la récupération de la vignette créée');

      const resource = this.vignetteMapper.toResource(vignetteWithRelations);
      if (!resource)
        throw new Error('Erreur lors de la conversion en resource');

      console.log('✅ Vignette créée avec succès:', resource.id);
      return resource;
    } catch (error) {
      console.log('🔴 ERREUR dans transaction:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ─── Lecture ──────────────────────────────────────────────────────────────

  async findAllVignettes(): Promise<VignetteResource[]> {
    const vignettes = await this.vignetteRepository.find({
      where: { estActif: true },
      relations: [
        'vehicule',
        'vehicule.marque',
        'lignesReglement',
        'lignesReglement.modePaiement',
      ],
      order: { saisiLe: 'DESC' },
    });
    return this.vignetteMapper.toResourceList(vignettes);
  }

  async findVignetteById(id: string): Promise<VignetteResource> {
    const entity = await this.findEntityById(id);
    const resource = this.vignetteMapper.toResource(entity);
    if (!resource) throw new Error('Erreur lors de la conversion en resource');
    return resource;
  }

  async findVignettesByVehicule(
    vehiculeId: string,
  ): Promise<VignetteResource[]> {
    const vignettes = await this.vignetteRepository.find({
      where: { vehiculeId, estActif: true },
      relations: [
        'vehicule',
        'vehicule.marque',
        'lignesReglement',
        'lignesReglement.modePaiement',
      ],
      order: { saisiLe: 'DESC' },
    });
    return this.vignetteMapper.toResourceList(vignettes);
  }

  // ─── Modification ─────────────────────────────────────────────────────────

  async updateVignette(input: UpdateVignetteInput): Promise<VignetteResource> {
    const existingEntity = await this.findEntityById(input.id);

    if (existingEntity.statut !== StatutVignette.BROUILLON) {
      throw new BadRequestException(
        `Impossible de modifier une vignette avec le statut "${existingEntity.statut}".`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let matriculeVehicule: string | undefined;
      if (input.vehiculeId && input.vehiculeId !== existingEntity.vehiculeId) {
        const vehiculeResource = await this.vehiculeService.findVehiculeById(
          input.vehiculeId,
        );
        matriculeVehicule = vehiculeResource.matricule;
        existingEntity.matriculeVehicule = matriculeVehicule;
      }

      const updatedEntity = this.vignetteMapper.updateInputToEntity(
        existingEntity,
        input,
      );
      await queryRunner.manager.save(Vignette, updatedEntity);

      if (input.lignesReglement !== undefined) {
        await queryRunner.manager.delete(LigneReglementVignette, {
          vignetteId: input.id,
        });
        const ligneEntities = input.lignesReglement.map((l) =>
          this.ligneMapper.createInputToEntity(l, input.id),
        );
        await queryRunner.manager.save(LigneReglementVignette, ligneEntities);
        updatedEntity.montantReste = this.calculerMontantReste(
          updatedEntity.montant,
          ligneEntities,
        );
        await queryRunner.manager.save(Vignette, updatedEntity);
      }

      await queryRunner.commitTransaction();

      const withRelations = await this.vignetteRepository.findOne({
        where: { id: input.id },
        relations: [
          'vehicule',
          'vehicule.marque',
          'lignesReglement',
          'lignesReglement.modePaiement',
        ],
      });

      const resource = this.vignetteMapper.toResource(withRelations!);
      if (!resource)
        throw new Error('Erreur lors de la conversion en resource');
      return resource;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ─── Actions métier ───────────────────────────────────────────────────────

  async validerVignette(
    id: string,
    validerPar: string,
  ): Promise<VignetteResource> {
    const vignette = await this.findEntityById(id);
    if (vignette.statut !== StatutVignette.BROUILLON) {
      throw new BadRequestException(
        `La vignette est déjà "${vignette.statut}".`,
      );
    }
    vignette.statut = StatutVignette.VALIDE;
    vignette.modifiePar = validerPar;
    await this.vignetteRepository.save(vignette);
    return this.findVignetteById(id);
  }

  async annulerVignette(
    id: string,
    annulePar: string,
  ): Promise<VignetteResource> {
    const vignette = await this.findEntityById(id);
    if (vignette.statut === StatutVignette.ANNULE) {
      throw new BadRequestException('La vignette est déjà annulée.');
    }
    vignette.statut = StatutVignette.ANNULE;
    vignette.modifiePar = annulePar;
    await this.vignetteRepository.save(vignette);
    return this.findVignetteById(id);
  }

  // ─── Suppression ──────────────────────────────────────────────────────────

  async deleteVignette(id: string): Promise<boolean> {
    const vignette = await this.findEntityById(id);
    if (vignette.statut === StatutVignette.VALIDE) {
      throw new BadRequestException(
        "Impossible de supprimer une vignette validée. Annulez-la d'abord.",
      );
    }
    vignette.estActif = false;
    await this.vignetteRepository.save(vignette);
    return true;
  }
}
