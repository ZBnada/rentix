import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarnetEntretien } from './entities/carnet-entretien.entity';
import { CarnetEntretienResource } from './dto/carnet-entretien.resource';
import { UpdateCarnetEntretienInput } from './dto/update-carnet-entretien.input';
import { CarnetEntretienMapper } from './mappers/carnet-entretien.mapper';

@Injectable()
export class CarnetEntretienService {
  constructor(
    @InjectRepository(CarnetEntretien)
    private readonly carnetRepository: Repository<CarnetEntretien>,
    private readonly carnetMapper: CarnetEntretienMapper,
  ) {}

  /**
   * 📋 Récupérer TOUS les entretiens d'un véhicule (depuis EntretienASuivre cochés)
   */
  async getEntretiensVehicule(
    vehiculeId: string,
  ): Promise<CarnetEntretienResource[]> {
    const entretiens = await this.carnetRepository.find({
      where: { vehiculeId, estActif: true },
      relations: ['vehicule', 'typeEntretien'],
      order: { dateDebut: 'DESC' },
    });

    return this.carnetMapper.toResourceList(entretiens);
  }

  /**
   * ✏️ Mettre à jour un entretien du carnet
   */
  async updateCarnetEntretien(
    input: UpdateCarnetEntretienInput,
  ): Promise<CarnetEntretienResource> {
    const existing = await this.carnetRepository.findOne({
      where: { id: input.id },
      relations: ['vehicule', 'typeEntretien'],
    });

    if (!existing) {
      throw new NotFoundException(
        `Entretien avec l'ID "${input.id}" introuvable`,
      );
    }

    const updated = this.carnetMapper.updateInputToEntity(existing, input);
    await this.carnetRepository.save(updated);

    const reloaded = await this.carnetRepository.findOne({
      where: { id: input.id },
      relations: ['vehicule', 'typeEntretien'],
    });

    const resource = this.carnetMapper.toResource(reloaded!);
    if (!resource) {
      throw new Error('Erreur lors de la conversion');
    }
    return resource;
  }

  /**
   * 🗑️ Supprimer un entretien du carnet (soft delete)
   */
  async deleteCarnetEntretien(id: string): Promise<boolean> {
    const entretien = await this.carnetRepository.findOne({ where: { id } });

    if (!entretien) {
      throw new NotFoundException(`Entretien avec l'ID "${id}" introuvable`);
    }

    entretien.estActif = false;
    await this.carnetRepository.save(entretien);

    return true;
  }
}
