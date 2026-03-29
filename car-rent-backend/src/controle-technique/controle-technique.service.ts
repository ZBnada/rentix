import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ControleTechnique } from './entities/controle-technique.entity';
import { LigneReglementControleTechnique } from './entities/ligne-reglement-controle-technique.entity';
import { ControleTechniqueResource } from './dto/controle-technique.resource';
import { CreateControleTechniqueInput } from './dto/create-controle-technique.input';
import { UpdateControleTechniqueInput } from './dto/update-controle-technique.input';
import { CreateLigneReglementControleTechniqueInput } from './dto/create-ligne-reglement-controle-technique.input';
import { StatutControleTechnique } from './enums/statut-controle-technique.enum';
import { ControleTechniqueMapper } from './mappers/controle-technique.mapper';
import { VehiculeService } from '../vehicule/vehicule.service';

const CONTROLE_RELATIONS = [
  'vehicule',
  'vehicule.marque',
  'lignesReglement',
  'lignesReglement.modePaiement',
];

@Injectable()
export class ControleTechniqueService {
  constructor(
    @InjectRepository(ControleTechnique)
    private readonly controleTechniqueRepository: Repository<ControleTechnique>,
    @InjectRepository(LigneReglementControleTechnique)
    private readonly ligneRepository: Repository<LigneReglementControleTechnique>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly mapper: ControleTechniqueMapper,
    private readonly vehiculeService: VehiculeService,
  ) {}

  // ── Queries ───────────────────────────────────────────────────────────────

  async findAll(): Promise<ControleTechniqueResource[]> {
    const entities = await this.controleTechniqueRepository.find({
      where: { estActif: true },
      relations: CONTROLE_RELATIONS,
      order: { numeroFiche: 'DESC' },
    });
    return this.mapper.toResourceList(entities);
  }

  async findById(id: string): Promise<ControleTechniqueResource> {
    const entity = await this.controleTechniqueRepository.findOne({
      where: { id, estActif: true },
      relations: CONTROLE_RELATIONS,
    });
    if (!entity)
      throw new NotFoundException(`Contrôle technique #${id} introuvable`);
    const resource = this.mapper.toResource(entity);
    if (!resource)
      throw new NotFoundException(`Contrôle technique #${id} introuvable`);
    return resource;
  }

  async findByVehicule(
    vehiculeId: string,
  ): Promise<ControleTechniqueResource[]> {
    const entities = await this.controleTechniqueRepository.find({
      where: { vehiculeId, estActif: true },
      relations: CONTROLE_RELATIONS,
      order: { numeroFiche: 'DESC' },
    });
    return this.mapper.toResourceList(entities);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private buildLigne(
    controleTechniqueId: string,
    l: CreateLigneReglementControleTechniqueInput,
  ): LigneReglementControleTechnique {
    const ligne = new LigneReglementControleTechnique();
    ligne.controleTechniqueId = controleTechniqueId;
    ligne.modePaiementId = l.modePaiementId;
    ligne.designation = l.designation; // string | undefined — entity uses ?
    ligne.montant = l.montant;
    ligne.echeance = l.echeance; // Date | undefined
    ligne.referencePiece = l.referencePiece; // string | undefined
    ligne.banque = l.banque; // string | undefined
    ligne.porteur = l.porteur; // string | undefined
    ligne.dateOperation = l.dateOperation;
    return ligne;
  }

  // ── Mutations ─────────────────────────────────────────────────────────────

  async createControleTechnique(
    input: CreateControleTechniqueInput,
  ): Promise<ControleTechniqueResource> {
    const vehiculeResource = await this.vehiculeService.findVehiculeById(
      input.vehiculeId,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ✅ Générer le prochain numéro de fiche (MAX + 1) dans la transaction
      const lastRecord = await queryRunner.manager.findOne(ControleTechnique, {
        order: { numeroFiche: 'DESC' },
        where: {},
      });
      const nextNumeroFiche = (lastRecord?.numeroFiche ?? 0) + 1;

      const entity = this.mapper.createInputToEntity(
        input,
        vehiculeResource.matricule,
      );
      entity.numeroFiche = nextNumeroFiche;
      const saved = await queryRunner.manager.save(ControleTechnique, entity);

      const lignes: LigneReglementControleTechnique[] = [];
      if (input.lignesReglement?.length) {
        for (const l of input.lignesReglement) {
          lignes.push(this.buildLigne(saved.id, l));
        }
        await queryRunner.manager.save(LigneReglementControleTechnique, lignes);
      }

      const totalRegle = lignes.reduce((sum, l) => sum + Number(l.montant), 0);
      saved.montantReste = Math.max(0, Number(input.montant) - totalRegle);
      await queryRunner.manager.save(ControleTechnique, saved);

      await queryRunner.commitTransaction();
      return this.findById(saved.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateControleTechnique(
    input: UpdateControleTechniqueInput,
  ): Promise<ControleTechniqueResource> {
    const existing = await this.controleTechniqueRepository.findOne({
      where: { id: input.id, estActif: true },
    });
    if (!existing)
      throw new NotFoundException(
        `Contrôle technique #${input.id} introuvable`,
      );
    if (existing.statut !== StatutControleTechnique.BROUILLON) {
      throw new BadRequestException(
        'Seul un contrôle en brouillon peut être modifié',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (input.vehiculeId) {
        const vehiculeResource = await this.vehiculeService.findVehiculeById(
          input.vehiculeId,
        );
        existing.vehiculeId = input.vehiculeId;
        existing.matriculeVehicule = vehiculeResource.matricule;
      }
      if (input.dateFinValidite)
        existing.dateFinValidite = input.dateFinValidite;
      if (input.montant !== undefined) existing.montant = input.montant;
      if (input.dateOperation) existing.dateOperation = input.dateOperation;
      if (input.modifiePar) existing.modifiePar = input.modifiePar;

      await queryRunner.manager.save(ControleTechnique, existing);
      await queryRunner.manager.delete(LigneReglementControleTechnique, {
        controleTechniqueId: input.id,
      });

      const lignes: LigneReglementControleTechnique[] = [];
      if (input.lignesReglement?.length) {
        for (const l of input.lignesReglement) {
          lignes.push(this.buildLigne(input.id, l));
        }
        await queryRunner.manager.save(LigneReglementControleTechnique, lignes);
      }

      const totalRegle = lignes.reduce((sum, l) => sum + Number(l.montant), 0);
      existing.montantReste = Math.max(
        0,
        Number(existing.montant) - totalRegle,
      );
      await queryRunner.manager.save(ControleTechnique, existing);

      await queryRunner.commitTransaction();
      return this.findById(input.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async validerControleTechnique(
    id: string,
    validerPar: string,
  ): Promise<ControleTechniqueResource> {
    const entity = await this.controleTechniqueRepository.findOne({
      where: { id },
    });
    if (!entity)
      throw new NotFoundException(`Contrôle technique #${id} introuvable`);
    if (entity.statut !== StatutControleTechnique.BROUILLON) {
      throw new BadRequestException(
        'Seul un contrôle en brouillon peut être validé',
      );
    }
    entity.statut = StatutControleTechnique.VALIDE;
    entity.validePar = validerPar;
    await this.controleTechniqueRepository.save(entity);
    return this.findById(id);
  }

  async annulerControleTechnique(
    id: string,
    annulePar: string,
  ): Promise<ControleTechniqueResource> {
    const entity = await this.controleTechniqueRepository.findOne({
      where: { id },
    });
    if (!entity)
      throw new NotFoundException(`Contrôle technique #${id} introuvable`);
    if (entity.statut === StatutControleTechnique.ANNULE) {
      throw new BadRequestException('Contrôle technique déjà annulé');
    }
    entity.statut = StatutControleTechnique.ANNULE;
    entity.annulePar = annulePar;
    await this.controleTechniqueRepository.save(entity);
    return this.findById(id);
  }

  async deleteControleTechnique(id: string): Promise<boolean> {
    const entity = await this.controleTechniqueRepository.findOne({
      where: { id },
    });
    if (!entity)
      throw new NotFoundException(`Contrôle technique #${id} introuvable`);
    if (entity.statut === StatutControleTechnique.VALIDE) {
      throw new BadRequestException(
        'Un contrôle validé ne peut pas être supprimé',
      );
    }
    entity.estActif = false;
    await this.controleTechniqueRepository.save(entity);
    return true;
  }
}
