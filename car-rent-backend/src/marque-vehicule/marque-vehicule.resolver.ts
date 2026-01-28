import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MarqueVehiculeService } from './marque-vehicule.service';
import { MarqueVehiculeResource } from './dto/marque-vehicule.resource';
import { CreateMarqueVehiculeInput } from './dto/create-marque-vehicule.input';
import { UpdateMarqueVehiculeInput } from './dto/update-marque-vehicule.input';

/**
 * Resolver GraphQL pour les marques de véhicules
 */
@Resolver(() => MarqueVehiculeResource)
export class MarqueVehiculeResolver {
  constructor(private readonly marqueVehiculeService: MarqueVehiculeService) {}

  /**
   * Mutation : Créer une nouvelle marque de véhicule
   */
  @Mutation(() => MarqueVehiculeResource, {
    name: 'createMarqueVehicule',
    description: 'Créer une nouvelle marque de véhicule',
  })
  async createMarqueVehicule(
    @Args('input', { type: () => CreateMarqueVehiculeInput })
    input: CreateMarqueVehiculeInput,
  ): Promise<MarqueVehiculeResource> {
    return this.marqueVehiculeService.createMarqueVehicule(input);
  }

  /**
   * Query : Récupérer toutes les marques actives
   */
  @Query(() => [MarqueVehiculeResource], {
    name: 'marquesVehicule',
    description: 'Récupérer toutes les marques de véhicules actives',
  })
  async findAllMarquesVehicule(): Promise<MarqueVehiculeResource[]> {
    return this.marqueVehiculeService.findAllMarquesVehicule();
  }

  /**
   * Query : Récupérer une marque par son ID
   */
  @Query(() => MarqueVehiculeResource, {
    name: 'marqueVehicule',
    description: 'Récupérer une marque de véhicule par son ID',
    nullable: true,
  })
  async findMarqueVehiculeById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<MarqueVehiculeResource> {
    return this.marqueVehiculeService.findMarqueVehiculeById(id);
  }

  /**
   * Query : Rechercher des marques par libellé (autocomplete)
   */
  @Query(() => [MarqueVehiculeResource], {
    name: 'searchMarquesVehicule',
    description:
      'Rechercher des marques de véhicules par libellé (autocomplete)',
  })
  async searchMarquesByLibelle(
    @Args('searchTerm', { type: () => String }) searchTerm: string,
  ): Promise<MarqueVehiculeResource[]> {
    return this.marqueVehiculeService.searchMarquesByLibelle(searchTerm);
  }

  /**
   * Mutation : Mettre à jour une marque
   */
  @Mutation(() => MarqueVehiculeResource, {
    name: 'updateMarqueVehicule',
    description: 'Mettre à jour une marque de véhicule',
  })
  async updateMarqueVehicule(
    @Args('input', { type: () => UpdateMarqueVehiculeInput })
    input: UpdateMarqueVehiculeInput,
  ): Promise<MarqueVehiculeResource> {
    return this.marqueVehiculeService.updateMarqueVehicule(input);
  }

  /**
   * Mutation : Supprimer une marque (soft delete)
   */
  @Mutation(() => Boolean, {
    name: 'deleteMarqueVehicule',
    description: 'Supprimer une marque de véhicule (désactivation)',
  })
  async deleteMarqueVehicule(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.marqueVehiculeService.deleteMarqueVehicule(id);
  }
}
