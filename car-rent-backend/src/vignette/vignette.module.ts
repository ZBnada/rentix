import { Module } from '@nestjs/common';
import { VignetteService } from './vignette.service';
import { VignetteResolver } from './vignette.resolver';

@Module({
  providers: [VignetteResolver, VignetteService],
})
export class VignetteModule {}
