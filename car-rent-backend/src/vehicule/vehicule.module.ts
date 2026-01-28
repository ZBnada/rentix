import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculeService } from './vehicule.service';
import { VehiculeResolver } from './vehicule.resolver';
import { VehiculeController } from './vehicule.controller'; // ← Ajouter
import { Vehicule } from './entities/vehicule.entity';
import { VehiculeMapper } from './mappers/vehicule.mapper';
import { MarqueVehiculeModule } from '../marque-vehicule/marque-vehicule.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicule]),
    MarqueVehiculeModule,
    UploadModule,
  ],
  controllers: [
    VehiculeController,
  ],
  providers: [VehiculeService, VehiculeResolver, VehiculeMapper],
  exports: [VehiculeService, VehiculeMapper],
})
export class VehiculeModule {}
