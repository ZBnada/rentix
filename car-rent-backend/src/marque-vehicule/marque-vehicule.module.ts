import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarqueVehicule } from './entities/marque-vehicule.entity';
import { MarqueVehiculeService } from './marque-vehicule.service';
import { MarqueVehiculeResolver } from './marque-vehicule.resolver';
import { MarqueVehiculeMapper } from './mappers/marque-vehicule.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarqueVehicule]), //  IMPORTANT : Enregistrer l'entité
  ],
  providers: [
    MarqueVehiculeService,
    MarqueVehiculeResolver,
    MarqueVehiculeMapper,
  ],
  exports: [
    MarqueVehiculeService,
    MarqueVehiculeMapper, //  Exporter pour VehiculeModule
  ],
})
export class MarqueVehiculeModule {}
