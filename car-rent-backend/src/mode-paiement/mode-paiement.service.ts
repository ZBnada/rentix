import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModePaiementEntity } from './entities/mode-paiement.entity';
import { CreateModePaiementInput } from './dto/create-mode-paiement.input';
import { UpdateModePaiementInput } from './dto/update-mode-paiement.input';
import { ModePaiementMapper } from './mappers/mode-paiement.mapper';
import { ModePaiementResource } from './dto/mode-paiement.resource';
import { modesPaiementSeed } from './data/seed-data';

/**
 * Service de gestion des modes de paiement
 */
@Injectable()
export class ModePaiementService implements OnModuleInit {
  constructor(
    @InjectRepository(ModePaiementEntity)
    private readonly modePaiementRepository: Repository<ModePaiementEntity>,
    private readonly modePaiementMapper: ModePaiementMapper,
  ) {}

  /**
   * Initialisation au démarrage du module
   * Charge les données pré-définies si la table est vide
   */
  async onModuleInit() {
    await this.seedModesPaiementIfEmpty();
  }

  /**
   * Seed les modes de paiement pré-définis si la table est vide
   */
  private async seedModesPaiementIfEmpty(): Promise<void> {
    const count = await this.modePaiementRepository.count();

    if (count === 0) {
      console.log('💳 Initialisation des modes de paiement...');

      const entities = modesPaiementSeed.map((modePaiementData) =>
        this.modePaiementMapper.createInputToEntity(modePaiementData),
      );

      await this.modePaiementRepository.save(entities);
      console.log(
        `✅ ${entities.length} modes de paiement ont été initialisés`,
      );
    }
  }

  /**
   * Créer un nouveau mode de paiement
   */
  async createModePaiement(
    input: CreateModePaiementInput,
  ): Promise<ModePaiementResource> {
    // Vérifier si le type existe déjà
    const existingModePaiement = await this.modePaiementRepository.findOne({
      where: { type: input.type },
    });

    if (existingModePaiement) {
      throw new ConflictException(
        `Un mode de paiement avec le type "${input.type}" existe déjà`,
      );
    }

    // Créer l'entité à partir de l'input
    const modePaiementEntity =
      this.modePaiementMapper.createInputToEntity(input);

    // Sauvegarder en base de données
    const savedEntity =
      await this.modePaiementRepository.save(modePaiementEntity);

    // Convertir en Resource et retourner
    const resource = this.modePaiementMapper.toResource(savedEntity);
    if (!resource) {
      throw new Error("Erreur lors de la conversion de l'entité en resource");
    }
    return resource;
  }

  /**
   * Récupérer tous les modes de paiement actifs
   */
  async findAllModesPaiement(): Promise<ModePaiementResource[]> {
    const modesPaiement = await this.modePaiementRepository.find({
      where: { estActif: true },
      order: { libelle: 'ASC' },
    });

    return this.modePaiementMapper.toResourceList(modesPaiement);
  }

  /**
   * Récupérer un mode de paiement par son ID
   */
  async findModePaiementById(id: string): Promise<ModePaiementResource> {
    const modePaiement = await this.modePaiementRepository.findOne({
      where: { id, estActif: true },
    });

    if (!modePaiement) {
      throw new NotFoundException(
        `Mode de paiement avec l'ID "${id}" introuvable`,
      );
    }

    const resource = this.modePaiementMapper.toResource(modePaiement);
    if (!resource) {
      throw new Error("Erreur lors de la conversion de l'entité en resource");
    }
    return resource;
  }

  /**
   * Rechercher des modes de paiement par libellé
   */
  async searchModesPaiementByLibelle(
    searchTerm: string,
  ): Promise<ModePaiementResource[]> {
    const modesPaiement = await this.modePaiementRepository
      .createQueryBuilder('modePaiement')
      .where('modePaiement.estActif = :estActif', { estActif: true })
      .andWhere('LOWER(modePaiement.libelle) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('modePaiement.libelle', 'ASC')
      .getMany();

    return this.modePaiementMapper.toResourceList(modesPaiement);
  }

  /**
   * Mettre à jour un mode de paiement
   */
  async updateModePaiement(
    input: UpdateModePaiementInput,
  ): Promise<ModePaiementResource> {
    // Récupérer le mode de paiement existant
    const existingModePaiement = await this.modePaiementRepository.findOne({
      where: { id: input.id },
    });

    if (!existingModePaiement) {
      throw new NotFoundException(
        `Mode de paiement avec l'ID "${input.id}" introuvable`,
      );
    }

    // Vérifier l'unicité du type si modifié
    if (input.type && input.type !== existingModePaiement.type) {
      const duplicateType = await this.modePaiementRepository.findOne({
        where: { type: input.type },
      });

      if (duplicateType) {
        throw new ConflictException(
          `Un mode de paiement avec le type "${input.type}" existe déjà`,
        );
      }
    }

    // Appliquer les modifications
    const updatedEntity = this.modePaiementMapper.updateInputToEntity(
      existingModePaiement,
      input,
    );

    // Sauvegarder
    const savedEntity = await this.modePaiementRepository.save(updatedEntity);

    const resource = this.modePaiementMapper.toResource(savedEntity);
    if (!resource) {
      throw new Error("Erreur lors de la conversion de l'entité en resource");
    }
    return resource;
  }

  /**
   * Supprimer un mode de paiement (soft delete)
   */
  async deleteModePaiement(id: string): Promise<boolean> {
    const modePaiement = await this.modePaiementRepository.findOne({
      where: { id },
    });

    if (!modePaiement) {
      throw new NotFoundException(
        `Mode de paiement avec l'ID "${id}" introuvable`,
      );
    }

    // Soft delete : marquer comme inactif
    modePaiement.estActif = false;
    await this.modePaiementRepository.save(modePaiement);

    return true;
  }
}
