import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Entretien } from './entities/entretien.entity';
import { CreateEntretienInput } from './dto/create-entretien.input';
import { UpdateEntretienInput } from './dto/update-entretien.input';
import { EntretienMapper } from './mappers/entretien.mapper';
import { EntretienResource } from './dto/entretien.resource';
import { NotificationService } from '../notification/notification.service';
import { ModuleType } from '../notification/enums/module-type.enum';
import { TypeNotification } from '../notification/enums/type-notification.enum';
import { PrioriteNotification } from '../notification/enums/priorite-notification.enum';

/**
 * Maintenance management service with notifications
 */
@Injectable()
export class EntretienService {
  private readonly logger = new Logger(EntretienService.name);

  constructor(
    @InjectRepository(Entretien)
    private readonly entretienRepository: Repository<Entretien>,
    private readonly entretienMapper: EntretienMapper,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Create a new maintenance record
   */
  async createEntretien(
    input: CreateEntretienInput,
  ): Promise<EntretienResource> {
    try {
      // Validate that end date >= start date
      const dateDebut = new Date(input.dateDebutOperation);
      const dateFin = new Date(input.dateFinOperation);

      if (isNaN(dateDebut.getTime())) {
        throw new BadRequestException(
          `Invalid start date: ${input.dateDebutOperation}`,
        );
      }

      if (isNaN(dateFin.getTime())) {
        throw new BadRequestException(
          `Invalid end date: ${input.dateFinOperation}`,
        );
      }

      if (dateFin < dateDebut) {
        throw new BadRequestException(
          'End date must be greater than or equal to start date',
        );
      }

      // Create entity from input
      const entretienEntity = this.entretienMapper.createInputToEntity(input);

      // Save to database
      const savedEntity = await this.entretienRepository.save(entretienEntity);

      // Retrieve complete entity with relations
      const entretienWithRelations = await this.entretienRepository.findOne({
        where: { id: savedEntity.id },
        relations: ['vehicule', 'vehicule.marque', 'typeEntretien'],
      });

      if (!entretienWithRelations) {
        throw new Error('Error retrieving created maintenance record');
      }

      const resource = this.entretienMapper.toResource(entretienWithRelations);

      if (!resource) {
        throw new Error('Error converting maintenance record to resource');
      }

      // ✅ If next maintenance deadline exists, create notification
      if (entretienWithRelations.dateLimiteProchainEntretien) {
        try {
          await this.creerNotificationProchainEntretien(entretienWithRelations);
        } catch (notifError) {
          this.logger.error(
            `Next maintenance notification error: ${notifError.message}`,
          );
        }
      }

      return resource;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error creating maintenance record: ${error.message}`,
      );
    }
  }

  /**
   * ✅ CORRECTION: Create ONE notification based on remaining days
   * Instead of checking if === 30, 7 or 1, create directly based on current situation
   */
  private async creerNotificationProchainEntretien(
    entretien: Entretien,
  ): Promise<void> {
    const dateLimite = new Date(entretien.dateLimiteProchainEntretien!);
    const aujourdhui = new Date();

    // Reset hours to compare dates only
    dateLimite.setHours(0, 0, 0, 0);
    aujourdhui.setHours(0, 0, 0, 0);

    const joursRestants = Math.ceil(
      (dateLimite.getTime() - aujourdhui.getTime()) / (1000 * 60 * 60 * 24),
    );

    this.logger.log(
      `Calculating remaining days for maintenance ${entretien.id}: ${joursRestants} days`,
    );

    // ✅ Determine notification type based on remaining days
    let type: TypeNotification;
    let priorite: PrioriteNotification;
    let icone: string;
    let couleur: string;
    let titre: string;
    let message: string;

    if (joursRestants <= 0) {
      // ✅ Overdue → OVERDUE (Critical red)
      type = TypeNotification.RETARD;
      priorite = PrioriteNotification.CRITIQUE;
      icone = 'x-circle';
      couleur = 'red';
      titre = '🚨 Overdue maintenance!';
      message = `The "${entretien.typeEntretien.designation}" maintenance was due on ${this.formatDate(dateLimite)}`;
    } else if (joursRestants === 1) {
      // ✅ 1 day → IMMINENT (Red)
      type = TypeNotification.IMMINENTE;
      priorite = PrioriteNotification.URGENTE;
      icone = 'alert-circle';
      couleur = 'red';
      titre = '🚨 Maintenance tomorrow!';
      message = `The next "${entretien.typeEntretien.designation}" is scheduled for TOMORROW (${this.formatDate(dateLimite)})`;
    } else if (joursRestants <= 7) {
      // ✅ 2-7 days → UPCOMING (Orange)
      type = TypeNotification.PROCHE;
      priorite = PrioriteNotification.HAUTE;
      icone = 'alert-triangle';
      couleur = 'orange';
      titre = '⚠️ Maintenance approaching';
      message = `The next "${entretien.typeEntretien.designation}" is scheduled in ${joursRestants} days (${this.formatDate(dateLimite)})`;
    } else if (joursRestants <= 30) {
      // ✅ 8-30 days → INFO (Blue)
      type = TypeNotification.INFO;
      priorite = PrioriteNotification.NORMALE;
      icone = 'info';
      couleur = 'blue';
      titre = 'Next maintenance to schedule';
      message = `The next "${entretien.typeEntretien.designation}" is scheduled in ${joursRestants} days (${this.formatDate(dateLimite)})`;
    } else {
      // ✅ > 30 days → No notification
      this.logger.log(
        `No notification created: too far away (${joursRestants} days)`,
      );
      return;
    }

    // ✅ Create notification
    await this.notificationService.creerNotification({
      module: ModuleType.ENTRETIEN,
      type,
      priorite,
      referenceId: entretien.id,
      referenceType: 'Entretien',
      titre,
      message,
      icone,
      couleur,
      vehiculeId: entretien.vehiculeId,
      metadata: JSON.stringify({
        typeEntretien: entretien.typeEntretien.designation,
        codeEntretien: entretien.typeEntretien.codeEntretien,
        dateLimiteProchainEntretien: entretien.dateLimiteProchainEntretien,
        kilometrageLimite: entretien.kilometrageLimiteProchainEntretien,
        joursRestants,
      }),
      actionUrl: `/entretiens/planifier`,
      actionLabel:
        joursRestants <= 1 ? 'Urgent action' : 'Schedule maintenance',
      creePar: 'EntretienService',
    });

    this.logger.log(
      `✅ Notification created: ${titre} (${joursRestants} days remaining)`,
    );
  }

  /**
   * Format a date in English
   */
  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  /**
   * Retrieve all active maintenance records
   */
  async findAllEntretiens(): Promise<EntretienResource[]> {
    const entretiens = await this.entretienRepository.find({
      where: { estActif: true },
      relations: ['vehicule', 'vehicule.marque', 'typeEntretien'],
      order: { dateDebutOperation: 'DESC' },
    });

    return this.entretienMapper.toResourceList(entretiens);
  }

  /**
   * Retrieve a maintenance record by ID
   */
  async findEntretienById(id: string): Promise<EntretienResource> {
    const entretien = await this.entretienRepository.findOne({
      where: { id, estActif: true },
      relations: ['vehicule', 'vehicule.marque', 'typeEntretien'],
    });

    if (!entretien) {
      throw new NotFoundException(
        `Maintenance record with ID "${id}" not found`,
      );
    }

    const resource = this.entretienMapper.toResource(entretien);

    if (!resource) {
      throw new Error('Error converting maintenance record to resource');
    }

    return resource;
  }

  /**
   * Retrieve maintenance records for a specific vehicle
   */
  async findEntretiensByVehicule(
    vehiculeId: string,
  ): Promise<EntretienResource[]> {
    const entretiens = await this.entretienRepository.find({
      where: { vehiculeId, estActif: true },
      relations: ['vehicule', 'vehicule.marque', 'typeEntretien'],
      order: { dateDebutOperation: 'DESC' },
    });

    return this.entretienMapper.toResourceList(entretiens);
  }

  /**
   * Retrieve maintenance records for a vehicle by maintenance type
   */
  async findEntretiensByVehiculeAndType(
    vehiculeId: string,
    typeEntretienId: string,
  ): Promise<EntretienResource[]> {
    const entretiens = await this.entretienRepository.find({
      where: {
        vehiculeId,
        typeEntretienId,
        estActif: true,
      },
      relations: ['vehicule', 'vehicule.marque', 'typeEntretien'],
      order: { dateDebutOperation: 'DESC' },
    });

    return this.entretienMapper.toResourceList(entretiens);
  }

  /**
   * Retrieve the last maintenance of a given type for a vehicle
   */
  async findDernierEntretienByTypeEtVehicule(
    vehiculeId: string,
    typeEntretienId: string,
  ): Promise<EntretienResource | null> {
    const entretien = await this.entretienRepository.findOne({
      where: {
        vehiculeId,
        typeEntretienId,
        estActif: true,
      },
      relations: ['vehicule', 'vehicule.marque', 'typeEntretien'],
      order: { dateDebutOperation: 'DESC' },
    });

    if (!entretien) {
      return null;
    }

    return this.entretienMapper.toResource(entretien);
  }

  /**
   * Retrieve maintenance records within a given period
   */
  async findEntretiensByPeriode(
    dateDebut: Date,
    dateFin: Date,
  ): Promise<EntretienResource[]> {
    const entretiens = await this.entretienRepository.find({
      where: {
        dateDebutOperation: Between(dateDebut, dateFin),
        estActif: true,
      },
      relations: ['vehicule', 'vehicule.marque', 'typeEntretien'],
      order: { dateDebutOperation: 'DESC' },
    });

    return this.entretienMapper.toResourceList(entretiens);
  }

  /**
   * Update a maintenance record
   */
  async updateEntretien(
    input: UpdateEntretienInput,
  ): Promise<EntretienResource> {
    // Retrieve existing maintenance record
    const existingEntretien = await this.entretienRepository.findOne({
      where: { id: input.id },
    });

    if (!existingEntretien) {
      throw new NotFoundException(
        `Maintenance record with ID "${input.id}" not found`,
      );
    }

    // Validate dates if modified
    const dateDebut = input.dateDebutOperation
      ? new Date(input.dateDebutOperation)
      : existingEntretien.dateDebutOperation;
    const dateFin = input.dateFinOperation
      ? new Date(input.dateFinOperation)
      : existingEntretien.dateFinOperation;

    if (dateFin < dateDebut) {
      throw new BadRequestException(
        'End date must be greater than or equal to start date',
      );
    }

    // Apply modifications
    const updatedEntity = this.entretienMapper.updateInputToEntity(
      existingEntretien,
      input,
    );

    // Save
    await this.entretienRepository.save(updatedEntity);

    // Retrieve updated entity with relations
    const entretienWithRelations = await this.entretienRepository.findOne({
      where: { id: input.id },
      relations: ['vehicule', 'vehicule.marque', 'typeEntretien'],
    });

    if (!entretienWithRelations) {
      throw new Error('Error retrieving updated maintenance record');
    }

    const resource = this.entretienMapper.toResource(entretienWithRelations);

    if (!resource) {
      throw new Error('Error converting maintenance record to resource');
    }

    return resource;
  }

  /**
   * Delete a maintenance record (soft delete)
   */
  async deleteEntretien(id: string): Promise<boolean> {
    const entretien = await this.entretienRepository.findOne({
      where: { id },
    });

    if (!entretien) {
      throw new NotFoundException(
        `Maintenance record with ID "${id}" not found`,
      );
    }

    // Soft delete: mark as inactive
    entretien.estActif = false;
    await this.entretienRepository.save(entretien);

    return true;
  }

  /**
   * Calculate total maintenance cost for a vehicle
   */
  async calculerCoutTotalParVehicule(vehiculeId: string): Promise<number> {
    const result = await this.entretienRepository
      .createQueryBuilder('entretien')
      .select('SUM(entretien.coutTotal)', 'total')
      .where('entretien.vehiculeId = :vehiculeId', { vehiculeId })
      .andWhere('entretien.estActif = :estActif', { estActif: true })
      .getRawOne();

    return parseFloat(result?.total || 0);
  }

  /**
   * Retrieve maintenance statistics
   */
  async getStatistiquesEntretiens(): Promise<{
    totalEntretiens: number;
    coutTotal: number;
    moyenneCout: number;
  }> {
    const result = await this.entretienRepository
      .createQueryBuilder('entretien')
      .select('COUNT(entretien.id)', 'count')
      .addSelect('SUM(entretien.coutTotal)', 'total')
      .addSelect('AVG(entretien.coutTotal)', 'moyenne')
      .where('entretien.estActif = :estActif', { estActif: true })
      .getRawOne();

    return {
      totalEntretiens: parseInt(result?.count || 0),
      coutTotal: parseFloat(result?.total || 0),
      moyenneCout: parseFloat(result?.moyenne || 0),
    };
  }
}
