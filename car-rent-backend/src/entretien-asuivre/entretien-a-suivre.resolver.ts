import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EntretienASuivreService } from './entretien-a-suivre.service';
import { EntretienConfigurationResource } from './dto/entretien-configuration.resource';

@Resolver(() => EntretienConfigurationResource)
export class EntretienASuivreResolver {
  constructor(
    private readonly entretienASuivreService: EntretienASuivreService,
  ) {}

  /**
   * Query : Récupérer la configuration complète pour un véhicule
   * ⭐ QUERY PRINCIPALE : Affiche tous les types d'entretien avec checkboxes
   */
  @Query(() => [EntretienConfigurationResource], {
    name: 'configurationEntretiensVehicule',
    description:
      "Récupérer tous les types d'entretien avec leur état (coché/non coché) pour un véhicule",
  })
  async getConfigurationEntretiensVehicule(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
  ): Promise<EntretienConfigurationResource[]> {
    return this.entretienASuivreService.getConfigurationEntretiensVehicule(
      vehiculeId,
    );
  }

  /**
   * Mutation : Toggle une checkbox d'entretien
   * ⭐ MUTATION PRINCIPALE : Cocher/décocher un entretien
   */
  @Mutation(() => Boolean, {
    name: 'toggleEntretienVehicule',
    description: "Cocher ou décocher un type d'entretien pour un véhicule",
  })
  async toggleEntretienVehicule(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
    @Args('typeEntretienId', { type: () => String }) typeEntretienId: string,
    @Args('estActive', { type: () => Boolean }) estActive: boolean,
  ): Promise<boolean> {
    return this.entretienASuivreService.toggleEntretienVehicule(
      vehiculeId,
      typeEntretienId,
      estActive,
    );
  }

  /**
   * Query : Récupérer uniquement les entretiens cochés pour un véhicule
   * 📋 UTILISÉ POUR LE CARNET D'ENTRETIEN (photo 2)
   */
  @Query(() => [EntretienConfigurationResource], {
    name: 'entretiensActifsVehicule',
    description:
      "Récupérer uniquement les types d'entretien cochés pour un véhicule",
  })
  async getEntretiensActifsVehicule(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
  ): Promise<EntretienConfigurationResource[]> {
    return this.entretienASuivreService.getEntretiensActifsVehicule(vehiculeId);
  }

  /**
   * Mutation : Valider la configuration
   * (Optionnel, si vous voulez un bouton "Valider (F5)")
   */
  @Mutation(() => Boolean, {
    name: 'validerConfigurationVehicule',
    description: 'Valider la configuration des entretiens pour un véhicule',
  })
  async validerConfigurationVehicule(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
  ): Promise<boolean> {
    return this.entretienASuivreService.validerConfigurationVehicule(
      vehiculeId,
    );
  }
}
