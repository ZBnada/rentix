import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarqueVehicule } from './entities/marque-vehicule.entity';
import { CreateMarqueVehiculeInput } from './dto/create-marque-vehicule.input';
import { UpdateMarqueVehiculeInput } from './dto/update-marque-vehicule.input';
import { MarqueVehiculeMapper } from './mappers/marque-vehicule.mapper';
import { MarqueVehiculeResource } from './dto/marque-vehicule.resource';
import { marqueVehicules } from './data/data';

/**
 * Service de gestion des marques de véhicules
 */
@Injectable()
export class MarqueVehiculeService implements OnModuleInit {
  constructor(
    @InjectRepository(MarqueVehicule)
    private readonly marqueVehiculeRepository: Repository<MarqueVehicule>,
    private readonly marqueVehiculeMapper: MarqueVehiculeMapper,
  ) {}

  /**
   * Initialisation au démarrage du module
   * Charge les données pré-définies si la table est vide
   */
  async onModuleInit() {
    await this.seedMarquesIfEmpty();
  }

  /**
   * Seed les marques pré-définies si la table est vide
   */
  private async seedMarquesIfEmpty(): Promise<void> {
    const count = await this.marqueVehiculeRepository.count();

    if (count === 0) {
      console.log('🚗 Initialisation des marques de véhicules...');

      const entities = marqueVehicules.map((marqueData) =>
        this.marqueVehiculeMapper.createInputToEntity(marqueData),
      );

      await this.marqueVehiculeRepository.save(entities);
      console.log(
        `✅ ${entities.length} marques de véhicules ont été initialisées`,
      );
    }
  }

  /**
   * Créer une nouvelle marque de véhicule
   */
  async createMarqueVehicule(
    input: CreateMarqueVehiculeInput,
  ): Promise<MarqueVehiculeResource> {
    // Vérifier si le libellé existe déjà
    const existingMarque = await this.marqueVehiculeRepository.findOne({
      where: { libelle: input.libelle },
    });

    if (existingMarque) {
      throw new ConflictException(
        `Une marque avec le libellé "${input.libelle}" existe déjà`,
      );
    }

    // Créer l'entité à partir de l'input
    const marqueEntity = this.marqueVehiculeMapper.createInputToEntity(input);

    // Sauvegarder en base de données
    const savedEntity = await this.marqueVehiculeRepository.save(marqueEntity);

    // Convertir en Resource et retourner
    const resource = this.marqueVehiculeMapper.toResource(savedEntity);
    if (!resource) {
      throw new Error("Erreur lors de la conversion de l'entité en resource");
    }
    return resource;
  }

  /**
   * Récupérer toutes les marques actives
   */
  async findAllMarquesVehicule(): Promise<MarqueVehiculeResource[]> {
    const marques = await this.marqueVehiculeRepository.find({
      where: { estActif: true },
      order: { libelle: 'ASC' },
    });

    return this.marqueVehiculeMapper.toResourceList(marques);
  }

  /**
   * Récupérer une marque par son ID
   */
  async findMarqueVehiculeById(id: string): Promise<MarqueVehiculeResource> {
    const marque = await this.marqueVehiculeRepository.findOne({
      where: { id, estActif: true },
    });

    if (!marque) {
      throw new NotFoundException(`Marque avec l'ID "${id}" introuvable`);
    }

    const resource = this.marqueVehiculeMapper.toResource(marque);
    if (!resource) {
      throw new Error("Erreur lors de la conversion de l'entité en resource");
    }
    return resource;
  }

  /**
   * Rechercher des marques par libellé (autocomplete)
   */
  async searchMarquesByLibelle(
    searchTerm: string,
  ): Promise<MarqueVehiculeResource[]> {
    const marques = await this.marqueVehiculeRepository
      .createQueryBuilder('marque')
      .where('marque.estActif = :estActif', { estActif: true })
      .andWhere('LOWER(marque.libelle) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('marque.libelle', 'ASC')
      .limit(20)
      .getMany();

    return this.marqueVehiculeMapper.toResourceList(marques);
  }

  /**
   * Mettre à jour une marque
   */
  async updateMarqueVehicule(
    input: UpdateMarqueVehiculeInput,
  ): Promise<MarqueVehiculeResource> {
    // Récupérer la marque existante
    const existingMarque = await this.marqueVehiculeRepository.findOne({
      where: { id: input.id },
    });

    if (!existingMarque) {
      throw new NotFoundException(`Marque avec l'ID "${input.id}" introuvable`);
    }

    // Vérifier l'unicité du libellé si modifié
    if (input.libelle && input.libelle !== existingMarque.libelle) {
      const duplicateLibelle = await this.marqueVehiculeRepository.findOne({
        where: { libelle: input.libelle },
      });

      if (duplicateLibelle) {
        throw new ConflictException(
          `Une marque avec le libellé "${input.libelle}" existe déjà`,
        );
      }
    }

    // Appliquer les modifications
    const updatedEntity = this.marqueVehiculeMapper.updateInputToEntity(
      existingMarque,
      input,
    );

    // Sauvegarder
    const savedEntity = await this.marqueVehiculeRepository.save(updatedEntity);

    const resource = this.marqueVehiculeMapper.toResource(savedEntity);
    if (!resource) {
      throw new Error("Erreur lors de la conversion de l'entité en resource");
    }
    return resource;
  }

  /**
   * Supprimer une marque (soft delete)
   */
  async deleteMarqueVehicule(id: string): Promise<boolean> {
    const marque = await this.marqueVehiculeRepository.findOne({
      where: { id },
    });

    if (!marque) {
      throw new NotFoundException(`Marque avec l'ID "${id}" introuvable`);
    }

    // Soft delete : marquer comme inactif
    marque.estActif = false;
    await this.marqueVehiculeRepository.save(marque);

    return true;
  }
}
