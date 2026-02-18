import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntretienASuivre } from './entities/entretien-a-suivre.entity';
import { TypeEntretien } from '../type-entretien/entities/type-entretien.entity';
import { CarnetEntretien } from '../carnet-entretien/entities/carnet-entretien.entity'; // ← Ajout
import { EntretienConfigurationResource } from './dto/entretien-configuration.resource';

@Injectable()
export class EntretienASuivreService {
  constructor(
    @InjectRepository(EntretienASuivre)
    private readonly entretienASuivreRepository: Repository<EntretienASuivre>,
    @InjectRepository(TypeEntretien)
    private readonly typeEntretienRepository: Repository<TypeEntretien>,
    @InjectRepository(CarnetEntretien) // ← Ajout
    private readonly carnetEntretienRepository: Repository<CarnetEntretien>,
  ) {}

  /**
   * Récupérer la configuration complète pour un véhicule
   */
  async getConfigurationEntretiensVehicule(
    vehiculeId: string,
  ): Promise<EntretienConfigurationResource[]> {
    const allTypesEntretien = await this.typeEntretienRepository.find({
      where: { estActif: true },
      order: { codeEntretien: 'ASC' },
    });

    const entretiensCoches = await this.entretienASuivreRepository.find({
      where: { vehiculeId, estActif: true },
    });

    const configurations: EntretienConfigurationResource[] =
      allTypesEntretien.map((type) => {
        const entretienCoche = entretiensCoches.find(
          (e) => e.typeEntretienId === type.id,
        );

        const config = new EntretienConfigurationResource();
        config.typeEntretienId = type.id;
        config.codeEntretien = type.codeEntretien;
        config.designation = type.designation;
        config.estActive = entretienCoche ? entretienCoche.estActive : false;
        config.entretienASuivreId = entretienCoche ? entretienCoche.id : null;
        config.frequenceJoursRecommandee = type.frequenceJoursRecommandee;
        config.frequenceKmRecommandee = type.frequenceKmRecommandee;
        config.coutMoyenEstime = type.coutMoyenEstime;
        config.estObligatoire = type.estObligatoire;

        return config;
      });

    return configurations;
  }

  /**
   * Toggle une checkbox d'entretien + CRÉER dans le carnet
   */
  async toggleEntretienVehicule(
    vehiculeId: string,
    typeEntretienId: string,
    estActive: boolean,
  ): Promise<boolean> {
    // 1. Chercher ou créer l'entrée dans entretiens_a_suivre
    let entretien = await this.entretienASuivreRepository.findOne({
      where: { vehiculeId, typeEntretienId },
    });

    if (entretien) {
      entretien.estActive = estActive;
      await this.entretienASuivreRepository.save(entretien);
    } else {
      entretien = new EntretienASuivre();
      entretien.vehiculeId = vehiculeId;
      entretien.typeEntretienId = typeEntretienId;
      entretien.estActive = estActive;
      entretien.estActif = true;
      await this.entretienASuivreRepository.save(entretien);
    }

    // 2. Si coché ET pas encore dans le carnet → créer automatiquement
    if (estActive) {
      const existeCarnet = await this.carnetEntretienRepository.findOne({
        where: { vehiculeId, typeEntretienId },
      });

      if (!existeCarnet) {
        // Récupérer le type d'entretien pour le coût estimé
        const typeEntretien = await this.typeEntretienRepository.findOne({
          where: { id: typeEntretienId },
        });

        const nouvelEntretien = new CarnetEntretien();
        nouvelEntretien.vehiculeId = vehiculeId;
        nouvelEntretien.typeEntretienId = typeEntretienId;
        nouvelEntretien.dateDebut = new Date();
        nouvelEntretien.dateFin = null;
        nouvelEntretien.kilometrageDebut = 0; // À définir selon votre logique
        nouvelEntretien.kilometrageFin = null;
        nouvelEntretien.coutEstime = typeEntretien?.coutMoyenEstime || 0;
        nouvelEntretien.coutReel = null;
        nouvelEntretien.notes = null;
        nouvelEntretien.statut = 'EN_ATTENTE';
        nouvelEntretien.saisiPar = 'System';
        nouvelEntretien.estActif = true;

        await this.carnetEntretienRepository.save(nouvelEntretien);
      }
    }

    return true;
  }

  /**
   * Récupérer les entretiens actifs
   */
  async getEntretiensActifsVehicule(
    vehiculeId: string,
  ): Promise<EntretienConfigurationResource[]> {
    const configurations =
      await this.getConfigurationEntretiensVehicule(vehiculeId);
    return configurations.filter((c) => c.estActive === true);
  }

  /**
   * Valider la configuration
   */
  async validerConfigurationVehicule(vehiculeId: string): Promise<boolean> {
    const entretiensActifs = await this.getEntretiensActifsVehicule(vehiculeId);
    console.log(
      `✅ Configuration validée pour le véhicule ${vehiculeId} : ${entretiensActifs.length} entretiens actifs`,
    );
    return true;
  }
}
