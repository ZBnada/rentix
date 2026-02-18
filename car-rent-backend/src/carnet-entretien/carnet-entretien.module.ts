import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarnetEntretien } from './entities/carnet-entretien.entity';
import { Vehicule } from '../vehicule/entities/vehicule.entity';
import { TypeEntretien } from '../type-entretien/entities/type-entretien.entity';
import { CarnetEntretienService } from './carnet-entretien.service';
import { CarnetEntretienResolver } from './carnet-entretien.resolver';
import { CarnetEntretienMapper } from './mappers/carnet-entretien.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarnetEntretien, Vehicule, TypeEntretien]),
  ],
  providers: [
    CarnetEntretienService,
    CarnetEntretienResolver,
    CarnetEntretienMapper,
  ],
  exports: [CarnetEntretienService],
})
export class CarnetEntretienModule {}
