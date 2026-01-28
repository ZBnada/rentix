  import { Injectable } from '@nestjs/common';
  import { Vehicule } from '../entities/vehicule.entity';
  import { VehiculeResource } from '../dto/vehicule.resource';
  import { CreateVehiculeInput } from '../dto/create-vehicule.input';
  import { UpdateVehiculeInput } from '../dto/update-vehicule.input';
  import { MarqueVehiculeMapper } from '../../marque-vehicule/mappers/marque-vehicule.mapper';

  /**
   * Mapper pour la conversion entre Entity et Resource/Input
   */
  @Injectable()
  export class VehiculeMapper {
    constructor(private readonly marqueVehiculeMapper: MarqueVehiculeMapper) {}

    /**
     * Convertit une entité Vehicule en Resource GraphQL
     */
    toResource(entity: Vehicule): VehiculeResource | null {
      if (!entity) {
        return null;
      }

      const resource = new VehiculeResource();
      resource.id = entity.id;
      resource.matricule = entity.matricule;
      resource.marqueId = entity.marqueId;

      const marqueResource = this.marqueVehiculeMapper.toResource(entity.marque);
      if (!marqueResource) {
        throw new Error('Erreur lors de la conversion de la marque en resource');
      }
      resource.marque = marqueResource;
      resource.type = entity.type;
      resource.datePremiereMiseEnCirculation =
        entity.datePremiereMiseEnCirculation;
      resource.puissance = entity.puissance;
      resource.energie = entity.energie;
      resource.compteur = entity.compteur;
      resource.couleur = entity.couleur;
      resource.prixAchat = Number(entity.prixAchat);
      resource.classeVehicule = entity.classeVehicule;
      resource.prixLocationJournee = Number(entity.prixLocationJournee);
      resource.prixHeureRetard = Number(entity.prixHeureRetard);
      resource.roueSecours = entity.roueSecours;
      resource.cricManivelle = entity.cricManivelle;
      resource.jeuHousse = entity.jeuHousse;
      resource.siegeBebe = entity.siegeBebe;
      resource.jeuTapis = entity.jeuTapis;
      resource.posteRadio = entity.posteRadio;
      resource.jeuEnjoliveurs = entity.jeuEnjoliveurs;
      resource.observations = entity.observations;
      resource.imageUrl = entity.imageUrl;
      resource.saisiPar = entity.saisiPar;
      resource.modifiePar = entity.modifiePar;
      resource.saisiLe = entity.saisiLe;
      resource.modifieLe = entity.modifieLe;
      resource.estActif = entity.estActif;

      return resource;
    }

    /**
     * Convertit un tableau d'entités en tableau de Resources
     */
    toResourceList(entities: Vehicule[]): VehiculeResource[] {
      return entities
        .map((entity) => this.toResource(entity))
        .filter((resource): resource is VehiculeResource => resource !== null);
    }

    /**
     * Convertit un CreateVehiculeInput en entité Vehicule
     */
    createInputToEntity(input: CreateVehiculeInput): Vehicule {
      const entity = new Vehicule();
      entity.matricule = input.matricule;
      entity.marqueId = input.marqueId;
      entity.type = input.type;
      entity.datePremiereMiseEnCirculation = input.datePremiereMiseEnCirculation;
      entity.puissance = input.puissance;
      entity.energie = input.energie;
      entity.compteur = input.compteur;
      entity.couleur = input.couleur ?? null;
      entity.prixAchat = input.prixAchat;
      entity.classeVehicule = input.classeVehicule;
      entity.prixLocationJournee = input.prixLocationJournee;
      entity.prixHeureRetard = input.prixHeureRetard;
      entity.roueSecours = input.roueSecours;
      entity.cricManivelle = input.cricManivelle;
      entity.jeuHousse = input.jeuHousse;
      entity.siegeBebe = input.siegeBebe;
      entity.jeuTapis = input.jeuTapis;
      entity.posteRadio = input.posteRadio;
      entity.jeuEnjoliveurs = input.jeuEnjoliveurs;
      entity.observations = input.observations ?? null;
      entity.imageUrl = input.imageUrl ?? null;
      entity.saisiPar = input.saisiPar ?? null;

      return entity;
    }

    /**
     * Applique les modifications d'un UpdateVehiculeInput sur une entité existante
     */
    updateInputToEntity(entity: Vehicule, input: UpdateVehiculeInput): Vehicule {
      if (input.matricule !== undefined) entity.matricule = input.matricule;
      if (input.marqueId !== undefined) entity.marqueId = input.marqueId;
      if (input.type !== undefined) entity.type = input.type;
      if (input.datePremiereMiseEnCirculation !== undefined)
        entity.datePremiereMiseEnCirculation =
          input.datePremiereMiseEnCirculation;
      if (input.puissance !== undefined) entity.puissance = input.puissance;
      if (input.energie !== undefined) entity.energie = input.energie;
      if (input.compteur !== undefined) entity.compteur = input.compteur;
      if (input.couleur !== undefined) entity.couleur = input.couleur;
      if (input.prixAchat !== undefined) entity.prixAchat = input.prixAchat;
      if (input.classeVehicule !== undefined)
        entity.classeVehicule = input.classeVehicule;
      if (input.prixLocationJournee !== undefined)
        entity.prixLocationJournee = input.prixLocationJournee;
      if (input.prixHeureRetard !== undefined)
        entity.prixHeureRetard = input.prixHeureRetard;
      if (input.roueSecours !== undefined) entity.roueSecours = input.roueSecours;
      if (input.cricManivelle !== undefined)
        entity.cricManivelle = input.cricManivelle;
      if (input.jeuHousse !== undefined) entity.jeuHousse = input.jeuHousse;
      if (input.siegeBebe !== undefined) entity.siegeBebe = input.siegeBebe;
      if (input.jeuTapis !== undefined) entity.jeuTapis = input.jeuTapis;
      if (input.posteRadio !== undefined) entity.posteRadio = input.posteRadio;
      if (input.jeuEnjoliveurs !== undefined)
        entity.jeuEnjoliveurs = input.jeuEnjoliveurs;
      if (input.observations !== undefined)
        entity.observations = input.observations;
      if (input.imageUrl !== undefined) entity.imageUrl = input.imageUrl;
      if (input.modifiePar !== undefined) entity.modifiePar = input.modifiePar;

      return entity;
    }
  }
