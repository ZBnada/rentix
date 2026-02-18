import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AssuranceService } from './assurance.service';
import { AssuranceResource } from './dto/assurance.resource';
import { CreateAssuranceInput } from './dto/create-assurance.input';
import { UpdateAssuranceInput } from './dto/update-assurance.input';

/**
 * Resolver GraphQL pour les assurances
 */
@Resolver(() => AssuranceResource)
export class AssuranceResolver {
  constructor(private readonly assuranceService: AssuranceService) {}

  /**
   * Mutation : Créer une nouvelle assurance
   */
  @Mutation(() => AssuranceResource, {
    name: 'createAssurance',
    description: 'Créer une nouvelle assurance avec ses règlements',
  })
  async createAssurance(
    @Args('input', { type: () => CreateAssuranceInput })
    input: CreateAssuranceInput,
  ): Promise<AssuranceResource> {
    return this.assuranceService.createAssurance(input);
  }

  /**
   * Query : Récupérer toutes les assurances actives
   */
  @Query(() => [AssuranceResource], {
    name: 'assurances',
    description: 'Récupérer toutes les assurances actives',
  })
  async findAllAssurances(): Promise<AssuranceResource[]> {
    return this.assuranceService.findAllAssurances();
  }

  /**
   * Query : Récupérer une assurance par son ID
   */
  @Query(() => AssuranceResource, {
    name: 'assurance',
    description: 'Récupérer une assurance par son ID',
    nullable: true,
  })
  async findAssuranceById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<AssuranceResource> {
    return this.assuranceService.findAssuranceById(id);
  }

  /**
   * Query : Récupérer les assurances d'un véhicule
   */
  @Query(() => [AssuranceResource], {
    name: 'assurancesByVehicule',
    description: "Récupérer toutes les assurances d'un véhicule spécifique",
  })
  async findAssurancesByVehicule(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
  ): Promise<AssuranceResource[]> {
    return this.assuranceService.findAssurancesByVehicule(vehiculeId);
  }

  /**
   * Query : Récupérer les assurances qui expirent bientôt
   */
  @Query(() => [AssuranceResource], {
    name: 'assurancesExpiringSoon',
    description: 'Récupérer les assurances qui expirent dans N jours',
  })
  async findAssurancesExpiringSoon(
    @Args('daysBeforeExpiry', { type: () => Int, defaultValue: 30 })
    daysBeforeExpiry: number,
  ): Promise<AssuranceResource[]> {
    return this.assuranceService.findAssurancesExpiringSoon(daysBeforeExpiry);
  }

  /**
   * Mutation : Mettre à jour une assurance
   */
  @Mutation(() => AssuranceResource, {
    name: 'updateAssurance',
    description: "Mettre à jour les informations d'une assurance",
  })
  async updateAssurance(
    @Args('input', { type: () => UpdateAssuranceInput })
    input: UpdateAssuranceInput,
  ): Promise<AssuranceResource> {
    return this.assuranceService.updateAssurance(input);
  }

  /**
   * Mutation : Supprimer une assurance (soft delete)
   */
  @Mutation(() => Boolean, {
    name: 'deleteAssurance',
    description: 'Supprimer une assurance (désactivation)',
  })
  async deleteAssurance(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.assuranceService.deleteAssurance(id);
  }
}
