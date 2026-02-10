import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TypeEntretienService } from './type-entretien.service';
import { TypeEntretienResource } from './dto/type-entretien.resource';
import { CreateTypeEntretienInput } from './dto/create-type-entretien.input';
import { UpdateTypeEntretienInput } from './dto/update-type-entretien.input';

/**
 * Resolver GraphQL pour les types d'entretien
 */
@Resolver(() => TypeEntretienResource)
export class TypeEntretienResolver {
  constructor(private readonly typeEntretienService: TypeEntretienService) {}

  /**
   * Mutation : Créer un nouveau type d'entretien
   */
  @Mutation(() => TypeEntretienResource, {
    name: 'createTypeEntretien',
    description: "Créer un nouveau type d'entretien",
  })
  async createTypeEntretien(
    @Args('input', { type: () => CreateTypeEntretienInput })
    input: CreateTypeEntretienInput,
  ): Promise<TypeEntretienResource> {
    return this.typeEntretienService.createTypeEntretien(input);
  }

  /**
   * Query : Récupérer tous les types d'entretien actifs
   */
  @Query(() => [TypeEntretienResource], {
    name: 'typesEntretien',
    description: "Récupérer tous les types d'entretien actifs",
  })
  async findAllTypesEntretien(): Promise<TypeEntretienResource[]> {
    return this.typeEntretienService.findAllTypesEntretien();
  }

  /**
   * Query : Récupérer un type d'entretien par son ID
   */
  @Query(() => TypeEntretienResource, {
    name: 'typeEntretien',
    description: "Récupérer un type d'entretien par son ID",
    nullable: true,
  })
  async findTypeEntretienById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<TypeEntretienResource> {
    return this.typeEntretienService.findTypeEntretienById(id);
  }

  /**
   * Query : Récupérer un type d'entretien par son code
   */
  @Query(() => TypeEntretienResource, {
    name: 'typeEntretienByCode',
    description: "Récupérer un type d'entretien par son code (E01, E02...)",
    nullable: true,
  })
  async findTypeEntretienByCode(
    @Args('code', { type: () => String }) code: string,
  ): Promise<TypeEntretienResource> {
    return this.typeEntretienService.findTypeEntretienByCode(code);
  }

  /**
   * Query : Rechercher des types d'entretien par désignation
   */
  @Query(() => [TypeEntretienResource], {
    name: 'searchTypesEntretien',
    description: "Rechercher des types d'entretien par désignation",
  })
  async searchTypesByDesignation(
    @Args('searchTerm', { type: () => String }) searchTerm: string,
  ): Promise<TypeEntretienResource[]> {
    return this.typeEntretienService.searchTypesByDesignation(searchTerm);
  }

  /**
   * Query : Récupérer les types d'entretien obligatoires
   */
  @Query(() => [TypeEntretienResource], {
    name: 'typesEntretienObligatoires',
    description: "Récupérer les types d'entretien obligatoires",
  })
  async findTypesObligatoires(): Promise<TypeEntretienResource[]> {
    return this.typeEntretienService.findTypesObligatoires();
  }

  /**
   * Mutation : Mettre à jour un type d'entretien
   */
  @Mutation(() => TypeEntretienResource, {
    name: 'updateTypeEntretien',
    description: "Mettre à jour un type d'entretien",
  })
  async updateTypeEntretien(
    @Args('input', { type: () => UpdateTypeEntretienInput })
    input: UpdateTypeEntretienInput,
  ): Promise<TypeEntretienResource> {
    return this.typeEntretienService.updateTypeEntretien(input);
  }

  /**
   * Mutation : Supprimer un type d'entretien (soft delete)
   */
  @Mutation(() => Boolean, {
    name: 'deleteTypeEntretien',
    description: "Supprimer un type d'entretien (désactivation)",
  })
  async deleteTypeEntretien(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.typeEntretienService.deleteTypeEntretien(id);
  }
}
