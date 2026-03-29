import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vignette } from './entities/vignette.entity';
import { LigneReglementVignette } from './entities/ligne-reglement.entity';
import { VignetteService } from './vignette.service';
import { VignetteResolver } from './vignette.resolver';
import { VignetteMapper } from './mappers/vignette.mapper';
import { LigneReglementVignetteMapper } from './mappers/Ligne-reglement-vignette.mapper';
import { VehiculeModule } from '../vehicule/vehicule.module';
import { ModePaiementModule } from '../mode-paiement/mode-paiement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vignette, LigneReglementVignette]),
    VehiculeModule,
    ModePaiementModule,
  ],
  providers: [
    VignetteService,
    VignetteResolver,
    VignetteMapper,
    LigneReglementVignetteMapper,
  ],
  exports: [VignetteService, VignetteMapper],
})
export class VignetteModule {}
