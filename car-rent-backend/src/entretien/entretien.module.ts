import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entretien } from './entities/entretien.entity';
import { EntretienService } from './entretien.service';
import { EntretienResolver } from './entretien.resolver';
import { EntretienMapper } from './mappers/entretien.mapper';
import { VehiculeModule } from '../vehicule/vehicule.module';
import { TypeEntretienModule } from '../type-entretien/type-entretien.module';
import { NotificationModule } from '../notification/notification.module';
/**
 * Module de gestion des entretiens
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Entretien]),
    VehiculeModule,
    TypeEntretienModule,
    NotificationModule,
  ],
  providers: [EntretienService, EntretienResolver, EntretienMapper],
  exports: [EntretienService, EntretienMapper],
})
export class EntretienModule {}
