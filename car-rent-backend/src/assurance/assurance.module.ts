import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assurance } from './entities/assurance.entity';
import { AssuranceReglement } from './entities/assurance-reglement.entity';
import { AssuranceService } from './assurance.service';
import { AssuranceResolver } from './assurance.resolver';
import { AssuranceController } from './assurance.controller';
import { AssuranceMapper } from './mappers/assurance.mapper';
import { AssuranceReglementMapper } from './mappers/assurance-reglement.mapper';
import { VehiculeModule } from '../vehicule/vehicule.module';
import { ModePaiementModule } from '../mode-paiement/mode-paiement.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assurance, AssuranceReglement]),
    VehiculeModule,
    ModePaiementModule,
    UploadModule,
  ],
  controllers: [AssuranceController],
  providers: [
    AssuranceService,
    AssuranceResolver,
    AssuranceMapper,
    AssuranceReglementMapper,
  ],
  exports: [AssuranceService, AssuranceMapper],
})
export class AssuranceModule {}
