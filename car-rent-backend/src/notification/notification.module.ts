import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './gateway/notification.gateway';
import { NotificationResolver } from './notification.resolver';
import { NotificationMapper } from './mappers/notification.mapper';
import { VehiculeModule } from '../vehicule/vehicule.module';

/**
 * Module centralisé de gestion des notifications
 *
 * Fonctionnalités :
 * - Création et gestion des notifications
 * - WebSocket pour notifications temps réel
 * - GraphQL API
 * - CRON pour nettoyage automatique
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    ScheduleModule.forRoot(), // Active le système de CRON
    VehiculeModule, // Pour la relation avec Vehicule
  ],
  providers: [
    NotificationService,
    NotificationGateway,
    NotificationResolver,
    NotificationMapper,
  ],
  exports: [
    NotificationService, // Exporté pour utilisation dans autres modules
    NotificationGateway, // Exporté pour émettre des notifications
    NotificationMapper,
  ],
})
export class NotificationModule {}
