import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ControleTechniqueService } from './controle-technique.service';
import { ControleTechniqueResource } from './dto/controle-technique.resource';
import { CreateControleTechniqueInput } from './dto/create-controle-technique.input';
import { UpdateControleTechniqueInput } from './dto/update-controle-technique.input';

@Resolver(() => ControleTechniqueResource)
export class ControleTechniqueResolver {
  constructor(
    private readonly controleTechniqueService: ControleTechniqueService,
  ) {}

  // ── Queries ───────────────────────────────────────────────

  @Query(() => [ControleTechniqueResource], { name: 'controlesTechniques' })
  findAll(): Promise<ControleTechniqueResource[]> {
    return this.controleTechniqueService.findAll();
  }

  @Query(() => ControleTechniqueResource, { name: 'controleTechnique' })
  findById(@Args('id') id: string): Promise<ControleTechniqueResource> {
    return this.controleTechniqueService.findById(id);
  }

  @Query(() => [ControleTechniqueResource], {
    name: 'controlesTechniquesByVehicule',
  })
  findByVehicule(
    @Args('vehiculeId') vehiculeId: string,
  ): Promise<ControleTechniqueResource[]> {
    return this.controleTechniqueService.findByVehicule(vehiculeId);
  }

  // ── Mutations ─────────────────────────────────────────────

  @Mutation(() => ControleTechniqueResource)
  createControleTechnique(
    @Args('input') input: CreateControleTechniqueInput,
  ): Promise<ControleTechniqueResource> {
    return this.controleTechniqueService.createControleTechnique(input);
  }

  @Mutation(() => ControleTechniqueResource)
  updateControleTechnique(
    @Args('input') input: UpdateControleTechniqueInput,
  ): Promise<ControleTechniqueResource> {
    return this.controleTechniqueService.updateControleTechnique(input);
  }

  @Mutation(() => ControleTechniqueResource)
  validerControleTechnique(
    @Args('id') id: string,
    @Args('validerPar') validerPar: string,
  ): Promise<ControleTechniqueResource> {
    return this.controleTechniqueService.validerControleTechnique(
      id,
      validerPar,
    );
  }

  @Mutation(() => ControleTechniqueResource)
  annulerControleTechnique(
    @Args('id') id: string,
    @Args('annulePar') annulePar: string,
  ): Promise<ControleTechniqueResource> {
    return this.controleTechniqueService.annulerControleTechnique(
      id,
      annulePar,
    );
  }

  @Mutation(() => Boolean)
  deleteControleTechnique(@Args('id') id: string): Promise<boolean> {
    return this.controleTechniqueService.deleteControleTechnique(id);
  }
}
