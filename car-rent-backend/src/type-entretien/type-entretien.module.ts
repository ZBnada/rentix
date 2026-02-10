import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeEntretien } from './entities/type-entretien.entity';
import { TypeEntretienService } from './type-entretien.service';
import { TypeEntretienResolver } from './type-entretien.resolver';
import { TypeEntretienMapper } from './mapper/type-entretien.mapper';

/**
 * Module de gestion des types d'entretien
 */
@Module({
  imports: [TypeOrmModule.forFeature([TypeEntretien])],
  providers: [TypeEntretienService, TypeEntretienResolver, TypeEntretienMapper],
  exports: [TypeEntretienService, TypeEntretienMapper],
})
export class TypeEntretienModule {}
