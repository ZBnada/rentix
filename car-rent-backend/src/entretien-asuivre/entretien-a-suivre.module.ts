import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntretienASuivre } from './entities/entretien-a-suivre.entity';
import { TypeEntretien } from '../type-entretien/entities/type-entretien.entity';
import { EntretienASuivreService } from './entretien-a-suivre.service';
import { EntretienASuivreResolver } from './entretien-a-suivre.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([EntretienASuivre, TypeEntretien])],
  providers: [EntretienASuivreService, EntretienASuivreResolver],
  exports: [EntretienASuivreService],
})
export class EntretienASuivreModule {}
