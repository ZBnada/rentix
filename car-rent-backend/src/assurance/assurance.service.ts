import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Assurance } from './entities/assurance.entity';
import { AssuranceReglement } from './entities/assurance-reglement.entity';
import { CreateAssuranceInput } from './dto/create-assurance.input';
import { UpdateAssuranceInput } from './dto/update-assurance.input';
import { AssuranceMapper } from './mappers/assurance.mapper';
import { AssuranceReglementMapper } from './mappers/assurance-reglement.mapper';
import { AssuranceResource } from './dto/assurance.resource';
import { UploadService } from '../upload/upload.service';

/**
 * Service de gestion des assurances
 */
@Injectable()
export class AssuranceService {
  constructor(
    @InjectRepository(Assurance)
    private readonly assuranceRepository: Repository<Assurance>,
    @InjectRepository(AssuranceReglement)
    private readonly assuranceReglementRepository: Repository<AssuranceReglement>,
    private readonly assuranceMapper: AssuranceMapper,
    private readonly assuranceReglementMapper: AssuranceReglementMapper,
    private readonly uploadService: UploadService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Créer une nouvelle assurance avec ses règlements
   */
  async createAssurance(
    input: CreateAssuranceInput,
  ): Promise<AssuranceResource> {
    console.log(
      '🔵 createAssurance - Input reçu:',
      JSON.stringify(input, null, 2),
    );

    // Validation : vérifier que la somme des règlements = montant total
    const sommeReglements = input.reglements.reduce(
      (sum, reglement) => sum + reglement.montant,
      0,
    );

    console.log('🔵 Somme règlements:', sommeReglements);
    console.log('🔵 Montant total:', input.montantTotal);

    if (Math.abs(sommeReglements - input.montantTotal) > 0.01) {
      const errorMsg = `La somme des règlements (${sommeReglements}) ne correspond pas au montant total (${input.montantTotal})`;
      console.log('🔴 ERREUR:', errorMsg);
      throw new BadRequestException(errorMsg);
    }

    // Utiliser une transaction pour garantir la cohérence
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('🔵 Début transaction...');

      // Créer l'assurance
      const assuranceEntity = this.assuranceMapper.createInputToEntity(input);
      console.log('🔵 Assurance entity créée:', assuranceEntity);

      const savedAssurance = await queryRunner.manager.save(
        Assurance,
        assuranceEntity,
      );
      console.log('🔵 Assurance sauvegardée:', savedAssurance.id);

      // Créer les règlements
      const reglementEntities = input.reglements.map((reglementInput) =>
        this.assuranceReglementMapper.createInputToEntity(
          reglementInput,
          savedAssurance.id,
        ),
      );
      console.log('🔵 Règlements entities créés:', reglementEntities.length);

      await queryRunner.manager.save(AssuranceReglement, reglementEntities);
      console.log('🔵 Règlements sauvegardés');

      await queryRunner.commitTransaction();
      console.log('🔵 Transaction commitée');

      // Récupérer l'assurance complète avec relations
      const assuranceWithRelations = await this.assuranceRepository.findOne({
        where: { id: savedAssurance.id },
        relations: [
          'vehicule',
          'vehicule.marque',
          'reglements',
          'reglements.modePaiement',
        ],
      });

      if (!assuranceWithRelations) {
        throw new Error("Erreur lors de la récupération de l'assurance créée");
      }

      console.log('🔵 Assurance récupérée avec relations');

      const resource = this.assuranceMapper.toResource(assuranceWithRelations);
      if (!resource) {
        throw new Error(
          "Erreur lors de la conversion de l'assurance en resource",
        );
      }

      console.log('✅ Assurance créée avec succès:', resource.id);
      return resource;
    } catch (error) {
      console.log('🔴 ERREUR dans transaction:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * UPLOAD DOCUMENT - Upload d'un document d'assurance
   */
  async uploadAssuranceDocument(
    assuranceId: string,
    file: Express.Multer.File,
  ): Promise<AssuranceResource> {
    const assurance = await this.assuranceRepository.findOne({
      where: { id: assuranceId },
      relations: [
        'vehicule',
        'vehicule.marque',
        'reglements',
        'reglements.modePaiement',
      ],
    });

    if (!assurance) {
      throw new NotFoundException(
        `Assurance avec l'ID "${assuranceId}" introuvable`,
      );
    }

    // Supprimer l'ancien document si il existe
    if (assurance.documentUrl) {
      await this.uploadService.deleteAssuranceDocument(assurance.documentUrl);
    }

    // Upload du nouveau document
    const uploadedFile = await this.uploadService.uploadAssuranceDocument(
      file,
      assuranceId,
    );

    // Mettre à jour l'assurance
    assurance.documentUrl = uploadedFile.filePath;
    await this.assuranceRepository.save(assurance);

    const resource = this.assuranceMapper.toResource(assurance);
    if (!resource) {
      throw new Error(
        "Erreur lors de la conversion de l'assurance en resource",
      );
    }
    return resource;
  }

  /**
   * DELETE DOCUMENT - Supprimer le document d'une assurance
   */
  async deleteAssuranceDocument(
    assuranceId: string,
  ): Promise<AssuranceResource> {
    const assurance = await this.assuranceRepository.findOne({
      where: { id: assuranceId },
      relations: [
        'vehicule',
        'vehicule.marque',
        'reglements',
        'reglements.modePaiement',
      ],
    });

    if (!assurance) {
      throw new NotFoundException(
        `Assurance avec l'ID "${assuranceId}" introuvable`,
      );
    }

    if (assurance.documentUrl) {
      await this.uploadService.deleteAssuranceDocument(assurance.documentUrl);
      assurance.documentUrl = null;
      await this.assuranceRepository.save(assurance);
    }

    const resource = this.assuranceMapper.toResource(assurance);
    if (!resource) {
      throw new Error(
        "Erreur lors de la conversion de l'assurance en resource",
      );
    }
    return resource;
  }

  /**
   * Récupérer toutes les assurances actives
   */
  async findAllAssurances(): Promise<AssuranceResource[]> {
    const assurances = await this.assuranceRepository.find({
      where: { estActif: true },
      relations: [
        'vehicule',
        'vehicule.marque',
        'reglements',
        'reglements.modePaiement',
      ],
      order: { dateDebut: 'DESC' },
    });

    return this.assuranceMapper.toResourceList(assurances);
  }

  /**
   * Récupérer une assurance par son ID
   */
  async findAssuranceById(id: string): Promise<AssuranceResource> {
    const assurance = await this.assuranceRepository.findOne({
      where: { id, estActif: true },
      relations: [
        'vehicule',
        'vehicule.marque',
        'reglements',
        'reglements.modePaiement',
      ],
    });

    if (!assurance) {
      throw new NotFoundException(`Assurance avec l'ID "${id}" introuvable`);
    }

    const resource = this.assuranceMapper.toResource(assurance);
    if (!resource) {
      throw new Error(
        "Erreur lors de la conversion de l'assurance en resource",
      );
    }
    return resource;
  }

  /**
   * Récupérer les assurances d'un véhicule
   */
  async findAssurancesByVehicule(
    vehiculeId: string,
  ): Promise<AssuranceResource[]> {
    const assurances = await this.assuranceRepository.find({
      where: { vehiculeId, estActif: true },
      relations: [
        'vehicule',
        'vehicule.marque',
        'reglements',
        'reglements.modePaiement',
      ],
      order: { dateDebut: 'DESC' },
    });

    return this.assuranceMapper.toResourceList(assurances);
  }

  /**
   * Récupérer les assurances qui expirent bientôt
   */
  async findAssurancesExpiringSoon(
    daysBeforeExpiry: number = 30,
  ): Promise<AssuranceResource[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysBeforeExpiry);

    const assurances = await this.assuranceRepository
      .createQueryBuilder('assurance')
      .leftJoinAndSelect('assurance.vehicule', 'vehicule')
      .leftJoinAndSelect('vehicule.marque', 'marque')
      .leftJoinAndSelect('assurance.reglements', 'reglements')
      .leftJoinAndSelect('reglements.modePaiement', 'modePaiement')
      .where('assurance.estActif = :estActif', { estActif: true })
      .andWhere('assurance.dateFinValidite BETWEEN :today AND :futureDate', {
        today,
        futureDate,
      })
      .orderBy('assurance.dateFinValidite', 'ASC')
      .getMany();

    return this.assuranceMapper.toResourceList(assurances);
  }

  /**
   * Mettre à jour une assurance
   */
  async updateAssurance(
    input: UpdateAssuranceInput,
  ): Promise<AssuranceResource> {
    const existingAssurance = await this.assuranceRepository.findOne({
      where: { id: input.id },
      relations: ['reglements'],
    });

    if (!existingAssurance) {
      throw new NotFoundException(
        `Assurance avec l'ID "${input.id}" introuvable`,
      );
    }

    // Utiliser une transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Mettre à jour l'assurance
      const updatedEntity = this.assuranceMapper.updateInputToEntity(
        existingAssurance,
        input,
      );
      await queryRunner.manager.save(Assurance, updatedEntity);

      // Si des règlements sont fournis, les remplacer
      if (input.reglements && input.reglements.length > 0) {
        // Validation de la somme
        const sommeReglements = input.reglements.reduce(
          (sum, reglement) => sum + reglement.montant,
          0,
        );

        const montantTotal =
          input.montantTotal ?? existingAssurance.montantTotal;

        if (Math.abs(sommeReglements - montantTotal) > 0.01) {
          throw new BadRequestException(
            `La somme des règlements (${sommeReglements}) ne correspond pas au montant total (${montantTotal})`,
          );
        }

        // Supprimer les anciens règlements
        await queryRunner.manager.delete(AssuranceReglement, {
          assuranceId: input.id,
        });

        // Créer les nouveaux règlements
        const reglementEntities = input.reglements.map((reglementInput) =>
          this.assuranceReglementMapper.createInputToEntity(
            reglementInput,
            input.id,
          ),
        );

        await queryRunner.manager.save(AssuranceReglement, reglementEntities);
      }

      await queryRunner.commitTransaction();

      // Récupérer l'assurance mise à jour
      const assuranceWithRelations = await this.assuranceRepository.findOne({
        where: { id: input.id },
        relations: [
          'vehicule',
          'vehicule.marque',
          'reglements',
          'reglements.modePaiement',
        ],
      });

      if (!assuranceWithRelations) {
        throw new Error(
          "Erreur lors de la récupération de l'assurance mise à jour",
        );
      }

      const resource = this.assuranceMapper.toResource(assuranceWithRelations);
      if (!resource) {
        throw new Error(
          "Erreur lors de la conversion de l'assurance en resource",
        );
      }
      return resource;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Supprimer une assurance (soft delete)
   */
  async deleteAssurance(id: string): Promise<boolean> {
    const assurance = await this.assuranceRepository.findOne({
      where: { id },
    });

    if (!assurance) {
      throw new NotFoundException(`Assurance avec l'ID "${id}" introuvable`);
    }

    // Supprimer le document si il existe
    if (assurance.documentUrl) {
      await this.uploadService.deleteAssuranceDocument(assurance.documentUrl);
    }

    // Soft delete
    assurance.estActif = false;
    await this.assuranceRepository.save(assurance);

    return true;
  }
}
