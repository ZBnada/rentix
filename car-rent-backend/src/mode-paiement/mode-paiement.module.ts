import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModePaiementEntity } from './entities/mode-paiement.entity';
import { ModePaiementService } from './mode-paiement.service';
import { ModePaiementResolver } from './mode-paiement.resolver';
import { ModePaiementMapper } from './mappers/mode-paiement.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModePaiementEntity]), // Enregistrer l'entité
  ],
  providers: [ModePaiementService, ModePaiementResolver, ModePaiementMapper],
  exports: [
    ModePaiementService,
    ModePaiementMapper, // Exporter pour utilisation dans d'autres modules (comme Assurance)
  ],
})
export class ModePaiementModule {}
