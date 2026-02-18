import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CarnetEntretienService } from './carnet-entretien.service';
import { CarnetEntretienResource } from './dto/carnet-entretien.resource';
import { UpdateCarnetEntretienInput } from './dto/update-carnet-entretien.input';

@Resolver(() => CarnetEntretienResource)
export class CarnetEntretienResolver {
  constructor(private readonly carnetService: CarnetEntretienService) {}

  /**
   * 📋 Query : Récupérer les entretiens d'un véhicule
   */
  @Query(() => [CarnetEntretienResource], {
    name: 'carnetEntretiensVehicule',
    description: 'Récupérer tous les entretiens du carnet pour un véhicule',
  })
  async getEntretiensVehicule(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
  ): Promise<CarnetEntretienResource[]> {
    return this.carnetService.getEntretiensVehicule(vehiculeId);
  }

  /**
   * ✏️ Mutation : Mettre à jour un entretien
   */
  @Mutation(() => CarnetEntretienResource, {
    name: 'updateCarnetEntretien',
    description: 'Mettre à jour un entretien du carnet',
  })
  async updateCarnetEntretien(
    @Args('input', { type: () => UpdateCarnetEntretienInput })
    input: UpdateCarnetEntretienInput,
  ): Promise<CarnetEntretienResource> {
    return this.carnetService.updateCarnetEntretien(input);
  }

  /**
   * 🗑️ Mutation : Supprimer un entretien
   */
  @Mutation(() => Boolean, {
    name: 'deleteCarnetEntretien',
    description: 'Supprimer un entretien du carnet (soft delete)',
  })
  async deleteCarnetEntretien(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.carnetService.deleteCarnetEntretien(id);
  }
}
