import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VehiculeService } from './vehicule.service';
import { VehiculeResource } from './dto/vehicule.resource';
import { CreateVehiculeInput } from './dto/create-vehicule.input';
import { UpdateVehiculeInput } from './dto/update-vehicule.input';

/**
 * Resolver GraphQL pour les véhicules
 */
@Resolver(() => VehiculeResource)
export class VehiculeResolver {
  constructor(private readonly vehiculeService: VehiculeService) {}

  /**
   * Mutation : Créer un nouveau véhicule
   */
  @Mutation(() => VehiculeResource, {
    name: 'createVehicule',
    description: 'Créer un nouveau véhicule dans le système',
  })
  async createVehicule(
    @Args('input', { type: () => CreateVehiculeInput })
    input: CreateVehiculeInput,
  ): Promise<VehiculeResource> {
    return this.vehiculeService.createVehicule(input);
  }

  /**
   * Query : Récupérer tous les véhicules actifs
   */
  @Query(() => [VehiculeResource], {
    name: 'vehicules',
    description: 'Récupérer tous les véhicules actifs',
  })
  async findAllVehicules(): Promise<VehiculeResource[]> {
    return this.vehiculeService.findAllVehicules();
  }

  /**
   * Query : Récupérer un véhicule par son ID
   */
  @Query(() => VehiculeResource, {
    name: 'vehicule',
    description: 'Récupérer un véhicule par son ID',
    nullable: true,
  })
  async findVehiculeById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<VehiculeResource> {
    return this.vehiculeService.findVehiculeById(id);
  }

  /**
   * Query : Récupérer un véhicule par son matricule
   */
  @Query(() => VehiculeResource, {
    name: 'vehiculeByMatricule',
    description: 'Récupérer un véhicule par son matricule',
    nullable: true,
  })
  async findVehiculeByMatricule(
    @Args('matricule', { type: () => String }) matricule: string,
  ): Promise<VehiculeResource> {
    return this.vehiculeService.findVehiculeByMatricule(matricule);
  }

  /**
   * Query : Récupérer les véhicules d'une marque
   */
  @Query(() => [VehiculeResource], {
    name: 'vehiculesByMarque',
    description: "Récupérer tous les véhicules d'une marque spécifique",
  })
  async findVehiculesByMarque(
    @Args('marqueId', { type: () => String }) marqueId: string,
  ): Promise<VehiculeResource[]> {
    return this.vehiculeService.findVehiculesByMarque(marqueId);
  }

  /**
   * Query : Récupérer les véhicules disponibles
   */
  @Query(() => [VehiculeResource], {
    name: 'vehiculesDisponibles',
    description:
      'Récupérer les véhicules disponibles (selon seuil de compteur)',
  })
  async findVehiculesDisponibles(
    @Args('seuilCompteur', { type: () => Number, nullable: true })
    seuilCompteur?: number,
  ): Promise<VehiculeResource[]> {
    return this.vehiculeService.findVehiculesDisponibles(seuilCompteur);
  }

  /**
   * Mutation : Mettre à jour un véhicule
   */
  @Mutation(() => VehiculeResource, {
    name: 'updateVehicule',
    description: "Mettre à jour les informations d'un véhicule",
  })
  async updateVehicule(
    @Args('input', { type: () => UpdateVehiculeInput })
    input: UpdateVehiculeInput,
  ): Promise<VehiculeResource> {
    return this.vehiculeService.updateVehicule(input);
  }

  /**
   * Mutation : Supprimer un véhicule (soft delete)
   */
  @Mutation(() => Boolean, {
    name: 'deleteVehicule',
    description: 'Supprimer un véhicule (désactivation)',
  })
  async deleteVehicule(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.vehiculeService.deleteVehicule(id);
  }
}
