import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { CreateVehiculeInput } from './dto/create-vehicule.input';
import { UpdateVehiculeInput } from './dto/update-vehicule.input';
import { VehiculeMapper } from './mappers/vehicule.mapper';
import { VehiculeResource } from './dto/vehicule.resource';
import { UploadService } from '../upload/upload.service';

/**
 * Service de gestion des véhicules
 */
@Injectable()
export class VehiculeService {
  constructor(
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,
    private readonly vehiculeMapper: VehiculeMapper,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Créer un nouveau véhicule
   */
  async createVehicule(input: CreateVehiculeInput): Promise<VehiculeResource> {
    // Vérifier si le matricule existe déjà
    const existingVehicule = await this.vehiculeRepository.findOne({
      where: { matricule: input.matricule },
    });

    if (existingVehicule) {
      throw new ConflictException(
        `Un véhicule avec le matricule "${input.matricule}" existe déjà`,
      );
    }

    // Créer l'entité à partir de l'input
    const vehiculeEntity = this.vehiculeMapper.createInputToEntity(input);

    // Sauvegarder en base de données
    const savedEntity = await this.vehiculeRepository.save(vehiculeEntity);

    // Récupérer l'entité complète avec les relations
    const vehiculeWithRelations = await this.vehiculeRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['marque'],
    });

    if (!vehiculeWithRelations) {
      throw new Error('Erreur lors de la récupération du véhicule créé');
    }

    // Convertir en Resource et retourner
    const resource = this.vehiculeMapper.toResource(vehiculeWithRelations);
    if (!resource) {
      throw new Error('Erreur lors de la conversion du véhicule en resource');
    }
    return resource;
  }

  /**
   * UPLOAD IMAGE - Upload d'une image de véhicule
   */
  async uploadVehicleImage(
    vehiculeId: string,
    file: Express.Multer.File,
  ): Promise<VehiculeResource> {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id: vehiculeId },
      relations: ['marque'],
    });

    if (!vehicule) {
      throw new NotFoundException(
        `Véhicule avec l'ID "${vehiculeId}" introuvable`,
      );
    }

    // Supprimer l'ancienne image si elle existe
    if (vehicule.imageUrl) {
      await this.uploadService.deleteVehicleImage(vehicule.imageUrl);
    }

    // Upload de la nouvelle image avec le UploadService
    const uploadedFile = await this.uploadService.uploadVehicleImage(
      file,
      vehiculeId,
    );

    console.log('📸 Upload résultat:', uploadedFile);

    // Mettre à jour le véhicule avec le chemin relatif
    vehicule.imageUrl = uploadedFile.filePath;
    await this.vehiculeRepository.save(vehicule);

    console.log('💾 Véhicule mis à jour avec imageUrl:', vehicule.imageUrl);

    // Recharger avec relations
    const updatedVehicule = await this.vehiculeRepository.findOne({
      where: { id: vehiculeId },
      relations: ['marque'],
    });

    const resource = this.vehiculeMapper.toResource(updatedVehicule!);
    if (!resource) {
      throw new Error('Erreur lors de la conversion du véhicule en resource');
    }
    return resource;
  }

  /**
   * DELETE IMAGE - Supprimer l'image d'un véhicule
   */
  async deleteVehicleImage(vehiculeId: string): Promise<VehiculeResource> {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id: vehiculeId },
      relations: ['marque'],
    });

    if (!vehicule) {
      throw new NotFoundException(
        `Véhicule avec l'ID "${vehiculeId}" introuvable`,
      );
    }

    if (vehicule.imageUrl) {
      await this.uploadService.deleteVehicleImage(vehicule.imageUrl);
      vehicule.imageUrl = null;
      await this.vehiculeRepository.save(vehicule);
    }

    const resource = this.vehiculeMapper.toResource(vehicule);
    if (!resource) {
      throw new Error('Erreur lors de la conversion du véhicule en resource');
    }
    return resource;
  }

  /**
   * Récupérer tous les véhicules actifs
   */
  async findAllVehicules(): Promise<VehiculeResource[]> {
    const vehicules = await this.vehiculeRepository.find({
      where: { estActif: true },
      relations: ['marque'],
      order: { matricule: 'ASC' },
    });

    return this.vehiculeMapper.toResourceList(vehicules);
  }

  /**
   * Récupérer un véhicule par son ID
   */
  async findVehiculeById(id: string): Promise<VehiculeResource> {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id, estActif: true },
      relations: ['marque'],
    });

    if (!vehicule) {
      throw new NotFoundException(`Véhicule avec l'ID "${id}" introuvable`);
    }

    const resource = this.vehiculeMapper.toResource(vehicule);
    if (!resource) {
      throw new Error('Erreur lors de la conversion du véhicule en resource');
    }
    return resource;
  }

  /**
   * Récupérer un véhicule par son matricule
   */
  async findVehiculeByMatricule(matricule: string): Promise<VehiculeResource> {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { matricule, estActif: true },
      relations: ['marque'],
    });

    if (!vehicule) {
      throw new NotFoundException(
        `Véhicule avec le matricule "${matricule}" introuvable`,
      );
    }

    const resource = this.vehiculeMapper.toResource(vehicule);
    if (!resource) {
      throw new Error('Erreur lors de la conversion du véhicule en resource');
    }
    return resource;
  }

  /**
   * Mettre à jour un véhicule
   */
  async updateVehicule(input: UpdateVehiculeInput): Promise<VehiculeResource> {
    // Récupérer le véhicule existant
    const existingVehicule = await this.vehiculeRepository.findOne({
      where: { id: input.id },
    });

    if (!existingVehicule) {
      throw new NotFoundException(
        `Véhicule avec l'ID "${input.id}" introuvable`,
      );
    }

    // Vérifier l'unicité du matricule si modifié
    if (input.matricule && input.matricule !== existingVehicule.matricule) {
      const duplicateMatricule = await this.vehiculeRepository.findOne({
        where: { matricule: input.matricule },
      });

      if (duplicateMatricule) {
        throw new ConflictException(
          `Un véhicule avec le matricule "${input.matricule}" existe déjà`,
        );
      }
    }

    // Appliquer les modifications
    const updatedEntity = this.vehiculeMapper.updateInputToEntity(
      existingVehicule,
      input,
    );

    // Sauvegarder
    await this.vehiculeRepository.save(updatedEntity);

    // Récupérer l'entité mise à jour avec les relations
    const vehiculeWithRelations = await this.vehiculeRepository.findOne({
      where: { id: input.id },
      relations: ['marque'],
    });

    if (!vehiculeWithRelations) {
      throw new Error('Erreur lors de la récupération du véhicule mis à jour');
    }

    const resource = this.vehiculeMapper.toResource(vehiculeWithRelations);
    if (!resource) {
      throw new Error('Erreur lors de la conversion du véhicule en resource');
    }
    return resource;
  }

  /**
   * Supprimer un véhicule (soft delete)
   */
  async deleteVehicule(id: string): Promise<boolean> {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id },
    });

    if (!vehicule) {
      throw new NotFoundException(`Véhicule avec l'ID "${id}" introuvable`);
    }

    // Supprimer l'image si elle existe
    if (vehicule.imageUrl) {
      await this.uploadService.deleteVehicleImage(vehicule.imageUrl);
    }

    // Soft delete : marquer comme inactif
    vehicule.estActif = false;
    await this.vehiculeRepository.save(vehicule);

    return true;
  }

  /**
   * Rechercher des véhicules par marque
   */
  async findVehiculesByMarque(marqueId: string): Promise<VehiculeResource[]> {
    const vehicules = await this.vehiculeRepository.find({
      where: { marqueId, estActif: true },
      relations: ['marque'],
      order: { matricule: 'ASC' },
    });

    return this.vehiculeMapper.toResourceList(vehicules);
  }

  /**
   * Rechercher des véhicules disponibles (compteur < seuil)
   */
  async findVehiculesDisponibles(
    seuilCompteur?: number,
  ): Promise<VehiculeResource[]> {
    const queryBuilder = this.vehiculeRepository
      .createQueryBuilder('vehicule')
      .leftJoinAndSelect('vehicule.marque', 'marque')
      .where('vehicule.estActif = :estActif', { estActif: true });

    if (seuilCompteur) {
      queryBuilder.andWhere('vehicule.compteur < :seuil', {
        seuil: seuilCompteur,
      });
    }

    const vehicules = await queryBuilder
      .orderBy('vehicule.matricule', 'ASC')
      .getMany();

    return this.vehiculeMapper.toResourceList(vehicules);
  }
}
