import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControleTechnique } from './entities/controle-technique.entity';
import { LigneReglementControleTechnique } from './entities/ligne-reglement-controle-technique.entity';
import { ControleTechniqueService } from './controle-technique.service';
import { ControleTechniqueResolver } from './controle-technique.resolver';
import { ControleTechniqueMapper } from './mappers/controle-technique.mapper';
import { LigneReglementControleTechniqueMapper } from './mappers/ligne-reglement-controle-technique.mapper';
import { VehiculeModule } from '../vehicule/vehicule.module';
import { ModePaiementModule } from '../mode-paiement/mode-paiement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ControleTechnique,
      LigneReglementControleTechnique,
    ]),
    VehiculeModule,
    ModePaiementModule,
  ],
  providers: [
    ControleTechniqueService,
    ControleTechniqueResolver,
    ControleTechniqueMapper,
    LigneReglementControleTechniqueMapper,
  ],
  exports: [ControleTechniqueService, ControleTechniqueMapper],
})
export class ControleTechniqueModule {}
