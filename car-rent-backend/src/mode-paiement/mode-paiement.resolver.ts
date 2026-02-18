import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ModePaiementService } from './mode-paiement.service';
import { ModePaiementResource } from './dto/mode-paiement.resource';
import { CreateModePaiementInput } from './dto/create-mode-paiement.input';
import { UpdateModePaiementInput } from './dto/update-mode-paiement.input';

/**
 * Resolver GraphQL pour les modes de paiement
 */
@Resolver(() => ModePaiementResource)
export class ModePaiementResolver {
  constructor(private readonly modePaiementService: ModePaiementService) {}

  /**
   * Mutation : Créer un nouveau mode de paiement
   */
  @Mutation(() => ModePaiementResource, {
    name: 'createModePaiement',
    description: 'Créer un nouveau mode de paiement',
  })
  async createModePaiement(
    @Args('input', { type: () => CreateModePaiementInput })
    input: CreateModePaiementInput,
  ): Promise<ModePaiementResource> {
    return this.modePaiementService.createModePaiement(input);
  }

  /**
   * Query : Récupérer tous les modes de paiement actifs
   */
  @Query(() => [ModePaiementResource], {
    name: 'modesPaiement',
    description: 'Récupérer tous les modes de paiement actifs',
  })
  async findAllModesPaiement(): Promise<ModePaiementResource[]> {
    return this.modePaiementService.findAllModesPaiement();
  }

  /**
   * Query : Récupérer un mode de paiement par son ID
   */
  @Query(() => ModePaiementResource, {
    name: 'modePaiement',
    description: 'Récupérer un mode de paiement par son ID',
    nullable: true,
  })
  async findModePaiementById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<ModePaiementResource> {
    return this.modePaiementService.findModePaiementById(id);
  }

  /**
   * Query : Rechercher des modes de paiement par libellé
   */
  @Query(() => [ModePaiementResource], {
    name: 'searchModesPaiement',
    description: 'Rechercher des modes de paiement par libellé',
  })
  async searchModesPaiementByLibelle(
    @Args('searchTerm', { type: () => String }) searchTerm: string,
  ): Promise<ModePaiementResource[]> {
    return this.modePaiementService.searchModesPaiementByLibelle(searchTerm);
  }

  /**
   * Mutation : Mettre à jour un mode de paiement
   */
  @Mutation(() => ModePaiementResource, {
    name: 'updateModePaiement',
    description: 'Mettre à jour un mode de paiement',
  })
  async updateModePaiement(
    @Args('input', { type: () => UpdateModePaiementInput })
    input: UpdateModePaiementInput,
  ): Promise<ModePaiementResource> {
    return this.modePaiementService.updateModePaiement(input);
  }

  /**
   * Mutation : Supprimer un mode de paiement (soft delete)
   */
  @Mutation(() => Boolean, {
    name: 'deleteModePaiement',
    description: 'Supprimer un mode de paiement (désactivation)',
  })
  async deleteModePaiement(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.modePaiementService.deleteModePaiement(id);
  }
}
