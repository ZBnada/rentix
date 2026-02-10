import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntretienASuivre } from './entities/entretien-a-suivre.entity';
import { TypeEntretien } from '../type-entretien/entities/type-entretien.entity';
import { EntretienConfigurationResource } from './dto/entretien-configuration.resource';

@Injectable()
export class EntretienASuivreService {
  constructor(
    @InjectRepository(EntretienASuivre)
    private readonly entretienASuivreRepository: Repository<EntretienASuivre>,
    @InjectRepository(TypeEntretien)
    private readonly typeEntretienRepository: Repository<TypeEntretien>,
  ) {}

  /**
   * Récupérer la configuration complète pour un véhicule
   * Retourne TOUS les types d'entretien avec leur état checkbox (coché/non coché)
   */
  async getConfigurationEntretiensVehicule(
    vehiculeId: string,
  ): Promise<EntretienConfigurationResource[]> {
    // 1. Récupérer TOUS les types d'entretien disponibles
    const allTypesEntretien = await this.typeEntretienRepository.find({
      where: { estActif: true },
      order: { codeEntretien: 'ASC' },
    });

    // 2. Récupérer les entretiens cochés pour ce véhicule
    const entretiensCoches = await this.entretienASuivreRepository.find({
      where: { vehiculeId, estActif: true },
    });

    // 3. Créer la configuration complète
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
   * Toggle une checkbox d'entretien
   * Cocher = créer ou activer
   * Décocher = désactiver
   */
  async toggleEntretienVehicule(
    vehiculeId: string,
    typeEntretienId: string,
    estActive: boolean,
  ): Promise<boolean> {
    // Chercher si existe déjà
    let entretien = await this.entretienASuivreRepository.findOne({
      where: { vehiculeId, typeEntretienId },
    });

    if (entretien) {
      // Existe déjà : mettre à jour le statut
      entretien.estActive = estActive;
      await this.entretienASuivreRepository.save(entretien);
    } else {
      // N'existe pas : créer une nouvelle entrée
      entretien = new EntretienASuivre();
      entretien.vehiculeId = vehiculeId;
      entretien.typeEntretienId = typeEntretienId;
      entretien.estActive = estActive;
      entretien.estActif = true;
      await this.entretienASuivreRepository.save(entretien);
    }

    return true;
  }

  /**
   * Récupérer les types d'entretien cochés pour un véhicule
   * Utilisé pour afficher dans le carnet d'entretien
   */
  async getEntretiensActifsVehicule(
    vehiculeId: string,
  ): Promise<EntretienConfigurationResource[]> {
    const configurations =
      await this.getConfigurationEntretiensVehicule(vehiculeId);

    // Filtrer uniquement les cochés
    return configurations.filter((c) => c.estActive === true);
  }

  /**
   * Valider et enregistrer toutes les sélections d'un véhicule
   * (optionnel, si vous voulez un bouton "Valider" global)
   */
  async validerConfigurationVehicule(vehiculeId: string): Promise<boolean> {
    // Cette méthode peut être utilisée pour :
    // - Logger une validation
    // - Envoyer une notification
    // - Préparer le carnet d'entretien
    // Pour l'instant, elle retourne juste true

    const entretiensActifs = await this.getEntretiensActifsVehicule(vehiculeId);

    console.log(
      `✅ Configuration validée pour le véhicule ${vehiculeId} : ${entretiensActifs.length} entretiens actifs`,
    );

    return true;
  }
}
