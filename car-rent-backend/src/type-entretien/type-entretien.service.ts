import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeEntretien } from './entities/type-entretien.entity';
import { CreateTypeEntretienInput } from './dto/create-type-entretien.input';
import { UpdateTypeEntretienInput } from './dto/update-type-entretien.input';
import { TypeEntretienMapper } from './mapper/type-entretien.mapper';
import { TypeEntretienResource } from './dto/type-entretien.resource';
import { typesEntretienData } from './data/types-entretien.data';

/**
 * Service de gestion des types d'entretien
 */
@Injectable()
export class TypeEntretienService implements OnModuleInit {
  constructor(
    @InjectRepository(TypeEntretien)
    private readonly typeEntretienRepository: Repository<TypeEntretien>,
    private readonly typeEntretienMapper: TypeEntretienMapper,
  ) {}

  /**
   * Initialisation au démarrage du module
   * Charge les types d'entretien pré-définis si la table est vide
   */
  async onModuleInit() {
    await this.seedTypesIfEmpty();
  }

  /**
   * Seed les types d'entretien pré-définis si la table est vide
   */
  private async seedTypesIfEmpty(): Promise<void> {
    const count = await this.typeEntretienRepository.count();

    if (count === 0) {
      console.log("🔧 Initialisation des types d'entretien...");

      const entities = typesEntretienData.map((data) =>
        this.typeEntretienMapper.createInputToEntity(data),
      );

      await this.typeEntretienRepository.save(entities);
      console.log(
        `✅ ${entities.length} types d'entretien ont été initialisés`,
      );
    }
  }

  /**
   * Créer un nouveau type d'entretien
   */
  async createTypeEntretien(
    input: CreateTypeEntretienInput,
  ): Promise<TypeEntretienResource> {
    // Vérifier si le code existe déjà
    const existingType = await this.typeEntretienRepository.findOne({
      where: { codeEntretien: input.codeEntretien },
    });

    if (existingType) {
      throw new ConflictException(
        `Un type d'entretien avec le code "${input.codeEntretien}" existe déjà`,
      );
    }

    // Créer l'entité
    const typeEntity = this.typeEntretienMapper.createInputToEntity(input);

    // Sauvegarder
    const savedEntity = await this.typeEntretienRepository.save(typeEntity);

    const resource = this.typeEntretienMapper.toResource(savedEntity);
    if (!resource) {
      throw new Error('Erreur lors de la conversion en resource');
    }
    return resource;
  }

  /**
   * Récupérer tous les types d'entretien actifs
   */
  async findAllTypesEntretien(): Promise<TypeEntretienResource[]> {
    const types = await this.typeEntretienRepository.find({
      where: { estActif: true },
      order: { codeEntretien: 'ASC' },
    });

    return this.typeEntretienMapper.toResourceList(types);
  }

  /**
   * Récupérer un type d'entretien par son ID
   */
  async findTypeEntretienById(id: string): Promise<TypeEntretienResource> {
    const type = await this.typeEntretienRepository.findOne({
      where: { id, estActif: true },
    });

    if (!type) {
      throw new NotFoundException(
        `Type d'entretien avec l'ID "${id}" introuvable`,
      );
    }

    const resource = this.typeEntretienMapper.toResource(type);
    if (!resource) {
      throw new Error('Erreur lors de la conversion en resource');
    }
    return resource;
  }

  /**
   * Récupérer un type d'entretien par son code
   */
  async findTypeEntretienByCode(code: string): Promise<TypeEntretienResource> {
    const type = await this.typeEntretienRepository.findOne({
      where: { codeEntretien: code, estActif: true },
    });

    if (!type) {
      throw new NotFoundException(
        `Type d'entretien avec le code "${code}" introuvable`,
      );
    }

    const resource = this.typeEntretienMapper.toResource(type);
    if (!resource) {
      throw new Error('Erreur lors de la conversion en resource');
    }
    return resource;
  }

  /**
   * Rechercher des types d'entretien par désignation
   */
  async searchTypesByDesignation(
    searchTerm: string,
  ): Promise<TypeEntretienResource[]> {
    const types = await this.typeEntretienRepository
      .createQueryBuilder('type')
      .where('type.estActif = :estActif', { estActif: true })
      .andWhere('LOWER(type.designation) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('type.codeEntretien', 'ASC')
      .getMany();

    return this.typeEntretienMapper.toResourceList(types);
  }

  /**
   * Récupérer les types d'entretien obligatoires
   */
  async findTypesObligatoires(): Promise<TypeEntretienResource[]> {
    const types = await this.typeEntretienRepository.find({
      where: { estActif: true, estObligatoire: true },
      order: { codeEntretien: 'ASC' },
    });

    return this.typeEntretienMapper.toResourceList(types);
  }

  /**
   * Mettre à jour un type d'entretien
   */
  async updateTypeEntretien(
    input: UpdateTypeEntretienInput,
  ): Promise<TypeEntretienResource> {
    // Récupérer le type existant
    const existingType = await this.typeEntretienRepository.findOne({
      where: { id: input.id },
    });

    if (!existingType) {
      throw new NotFoundException(
        `Type d'entretien avec l'ID "${input.id}" introuvable`,
      );
    }

    // Vérifier l'unicité du code si modifié
    if (
      input.codeEntretien &&
      input.codeEntretien !== existingType.codeEntretien
    ) {
      const duplicateCode = await this.typeEntretienRepository.findOne({
        where: { codeEntretien: input.codeEntretien },
      });

      if (duplicateCode) {
        throw new ConflictException(
          `Un type d'entretien avec le code "${input.codeEntretien}" existe déjà`,
        );
      }
    }

    // Appliquer les modifications
    const updatedEntity = this.typeEntretienMapper.updateInputToEntity(
      existingType,
      input,
    );

    // Sauvegarder
    const savedEntity = await this.typeEntretienRepository.save(updatedEntity);

    const resource = this.typeEntretienMapper.toResource(savedEntity);
    if (!resource) {
      throw new Error('Erreur lors de la conversion en resource');
    }
    return resource;
  }

  /**
   * Supprimer un type d'entretien (soft delete)
   */
  async deleteTypeEntretien(id: string): Promise<boolean> {
    const type = await this.typeEntretienRepository.findOne({
      where: { id },
    });

    if (!type) {
      throw new NotFoundException(
        `Type d'entretien avec l'ID "${id}" introuvable`,
      );
    }

    // Soft delete : marquer comme inactif
    type.estActif = false;
    await this.typeEntretienRepository.save(type);

    return true;
  }
}
