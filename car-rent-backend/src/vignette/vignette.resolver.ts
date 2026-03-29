import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VignetteService } from './vignette.service';
import { VignetteResource } from './dto/vignette.resource';
import { CreateVignetteInput } from './dto/create-vignette.input';
import { UpdateVignetteInput } from './dto/update-vignette.input';

@Resolver(() => VignetteResource)
export class VignetteResolver {
  constructor(private readonly vignetteService: VignetteService) {}

  @Mutation(() => VignetteResource, { name: 'createVignette' })
  async createVignette(
    @Args('input', { type: () => CreateVignetteInput })
    input: CreateVignetteInput,
  ): Promise<VignetteResource> {
    return this.vignetteService.createVignette(input);
  }

  @Mutation(() => VignetteResource, { name: 'updateVignette' })
  async updateVignette(
    @Args('input', { type: () => UpdateVignetteInput })
    input: UpdateVignetteInput,
  ): Promise<VignetteResource> {
    return this.vignetteService.updateVignette(input);
  }

  @Mutation(() => VignetteResource, { name: 'validerVignette' })
  async validerVignette(
    @Args('id', { type: () => String }) id: string,
    @Args('validerPar', { type: () => String }) validerPar: string,
  ): Promise<VignetteResource> {
    return this.vignetteService.validerVignette(id, validerPar);
  }

  @Mutation(() => VignetteResource, { name: 'annulerVignette' })
  async annulerVignette(
    @Args('id', { type: () => String }) id: string,
    @Args('annulePar', { type: () => String }) annulePar: string,
  ): Promise<VignetteResource> {
    return this.vignetteService.annulerVignette(id, annulePar);
  }

  @Mutation(() => Boolean, { name: 'deleteVignette' })
  async deleteVignette(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.vignetteService.deleteVignette(id);
  }

  @Query(() => [VignetteResource], { name: 'vignettes' })
  async findAllVignettes(): Promise<VignetteResource[]> {
    return this.vignetteService.findAllVignettes();
  }

  @Query(() => VignetteResource, { name: 'vignette', nullable: true })
  async findVignetteById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<VignetteResource> {
    return this.vignetteService.findVignetteById(id);
  }

  @Query(() => [VignetteResource], { name: 'vignettesByVehicule' })
  async findVignettesByVehicule(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
  ): Promise<VignetteResource[]> {
    return this.vignetteService.findVignettesByVehicule(vehiculeId);
  }
}
