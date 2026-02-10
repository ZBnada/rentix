import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EntretienService } from './entretien.service';
import { EntretienResource } from './dto/entretien.resource';
import { CreateEntretienInput } from './dto/create-entretien.input';
import { UpdateEntretienInput } from './dto/update-entretien.input';

/**
 * Resolver GraphQL pour les entretiens
 */
@Resolver(() => EntretienResource)
export class EntretienResolver {
  constructor(private readonly entretienService: EntretienService) {}

  /**
   * Mutation : Créer un nouvel entretien
   */
  @Mutation(() => EntretienResource, {
    name: 'createEntretien',
    description: 'Créer un nouvel entretien pour un véhicule',
  })
  async createEntretien(
    @Args('input', { type: () => CreateEntretienInput })
    input: CreateEntretienInput,
  ): Promise<EntretienResource> {
    return this.entretienService.createEntretien(input);
  }

  /**
   * Query : Récupérer tous les entretiens actifs
   */
  @Query(() => [EntretienResource], {
    name: 'entretiens',
    description: 'Récupérer tous les entretiens actifs',
  })
  async findAllEntretiens(): Promise<EntretienResource[]> {
    return this.entretienService.findAllEntretiens();
  }

  /**
   * Query : Récupérer un entretien par son ID
   */
  @Query(() => EntretienResource, {
    name: 'entretien',
    description: 'Récupérer un entretien par son ID',
    nullable: true,
  })
  async findEntretienById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<EntretienResource> {
    return this.entretienService.findEntretienById(id);
  }

  /**
   * Query : Récupérer les entretiens d'un véhicule
   */
  @Query(() => [EntretienResource], {
    name: 'entretiensByVehicule',
    description: "Récupérer tous les entretiens d'un véhicule spécifique",
  })
  async findEntretiensByVehicule(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
  ): Promise<EntretienResource[]> {
    return this.entretienService.findEntretiensByVehicule(vehiculeId);
  }

  /**
   * Query : Récupérer les entretiens d'un véhicule filtrés par type
   */
  @Query(() => [EntretienResource], {
    name: 'entretiensByVehiculeAndType',
    description:
      "Récupérer les entretiens d'un véhicule filtrés par type (ex: toutes les vidanges)",
  })
  async findEntretiensByVehiculeAndType(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
    @Args('typeEntretienId', { type: () => String }) typeEntretienId: string,
  ): Promise<EntretienResource[]> {
    return this.entretienService.findEntretiensByVehiculeAndType(
      vehiculeId,
      typeEntretienId,
    );
  }

  /**
   * Query : Récupérer le dernier entretien d'un type pour un véhicule
   */
  @Query(() => EntretienResource, {
    name: 'dernierEntretienByTypeEtVehicule',
    description:
      "Récupérer le dernier entretien d'un type donné pour un véhicule",
    nullable: true,
  })
  async findDernierEntretienByTypeEtVehicule(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
    @Args('typeEntretienId', { type: () => String }) typeEntretienId: string,
  ): Promise<EntretienResource | null> {
    return this.entretienService.findDernierEntretienByTypeEtVehicule(
      vehiculeId,
      typeEntretienId,
    );
  }

  /**
   * Query : Récupérer les entretiens dans une période
   */
  @Query(() => [EntretienResource], {
    name: 'entretiensByPeriode',
    description: 'Récupérer les entretiens dans une période donnée',
  })
  async findEntretiensByPeriode(
    @Args('dateDebut', { type: () => Date }) dateDebut: Date,
    @Args('dateFin', { type: () => Date }) dateFin: Date,
  ): Promise<EntretienResource[]> {
    return this.entretienService.findEntretiensByPeriode(dateDebut, dateFin);
  }

  /**
   * Mutation : Mettre à jour un entretien
   */
  @Mutation(() => EntretienResource, {
    name: 'updateEntretien',
    description: "Mettre à jour les informations d'un entretien",
  })
  async updateEntretien(
    @Args('input', { type: () => UpdateEntretienInput })
    input: UpdateEntretienInput,
  ): Promise<EntretienResource> {
    return this.entretienService.updateEntretien(input);
  }

  /**
   * Mutation : Supprimer un entretien (soft delete)
   */
  @Mutation(() => Boolean, {
    name: 'deleteEntretien',
    description: 'Supprimer un entretien (désactivation)',
  })
  async deleteEntretien(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.entretienService.deleteEntretien(id);
  }

  /**
   * Query : Calculer le coût total des entretiens pour un véhicule
   */
  @Query(() => Number, {
    name: 'coutTotalEntretiensVehicule',
    description: 'Calculer le coût total des entretiens pour un véhicule',
  })
  async calculerCoutTotalParVehicule(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
  ): Promise<number> {
    return this.entretienService.calculerCoutTotalParVehicule(vehiculeId);
  }
}
