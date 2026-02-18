import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VignetteService } from './vignette.service';
import { Vignette } from './entities/vignette.entity';
import { CreateVignetteInput } from './dto/create-vignette.input';
import { UpdateVignetteInput } from './dto/update-vignette.input';

@Resolver(() => Vignette)
export class VignetteResolver {
  constructor(private readonly vignetteService: VignetteService) {}

  @Mutation(() => Vignette)
  createVignette(@Args('createVignetteInput') createVignetteInput: CreateVignetteInput) {
    return this.vignetteService.create(createVignetteInput);
  }

  @Query(() => [Vignette], { name: 'vignette' })
  findAll() {
    return this.vignetteService.findAll();
  }

  @Query(() => Vignette, { name: 'vignette' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.vignetteService.findOne(id);
  }

  @Mutation(() => Vignette)
  updateVignette(@Args('updateVignetteInput') updateVignetteInput: UpdateVignetteInput) {
    return this.vignetteService.update(updateVignetteInput.id, updateVignetteInput);
  }

  @Mutation(() => Vignette)
  removeVignette(@Args('id', { type: () => Int }) id: number) {
    return this.vignetteService.remove(id);
  }
}
