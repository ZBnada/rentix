import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationResource } from '../dto/notification.resource';

/**
 * WebSocket Gateway pour les notifications en temps réel
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
@WebSocketGateway({
  cors: {
    origin: '*', // À configurer selon votre environnement
    credentials: true,
  },
  namespace: '/notifications', // Namespace dédié aux notifications
})
@Injectable()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private connectedClients: Map<string, Socket> = new Map();
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set<socketId>

  /**
   * Événement : Connexion d'un client
   */
  handleConnection(client: Socket) {
    this.logger.log(`Client connecté: ${client.id}`);
    this.connectedClients.set(client.id, client);

    // Envoyer un message de bienvenue
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    client.emit('connection-success', {
      message: 'Connexion WebSocket établie avec succès',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      socketId: client.id,
      timestamp: new Date(),
    });
  }

  /**
   * Événement : Déconnexion d'un client
   */
  handleDisconnect(client: Socket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.logger.log(`Client déconnecté: ${client.id}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    this.connectedClients.delete(client.id);

    // Nettoyer le mapping userId -> socketId
    this.userSockets.forEach((sockets, userId) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    });
  }

  /**
   * Message : S'abonner aux notifications d'un utilisateur
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @SubscribeMessage('subscribe-user')
  handleSubscribeUser(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @MessageBody() data: { userId: string },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = data;

    if (!userId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      client.emit('error', { message: 'userId est requis' });
      return;
    }

    // Ajouter le socket à la liste des sockets de l'utilisateur
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.userSockets.get(userId).add(client.id);

    this.logger.log(
      `Client ${client.id} abonné aux notifications de l'utilisateur ${userId}`,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    client.emit('subscription-success', {
      message: `Abonné aux notifications de l'utilisateur ${userId}`,
      userId,
    });
  }

  /**
   * Message : Se désabonner des notifications
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @SubscribeMessage('unsubscribe-user')
  handleUnsubscribeUser(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @MessageBody() data: { userId: string },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = data;

    if (this.userSockets.has(userId)) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.userSockets.get(userId).delete(client.id);
      // @ts-ignore
      if (this.userSockets.get(userId).size === 0) {
        this.userSockets.delete(userId);
      }
    }

    this.logger.log(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      `Client ${client.id} désabonné des notifications de l'utilisateur ${userId}`,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    client.emit('unsubscription-success', {
      message: `Désabonné des notifications de l'utilisateur ${userId}`,
      userId,
    });
  }

  /**
   * Émettre une nouvelle notification à tous les clients
   */
  emitNewNotification(notification: NotificationResource) {
    this.logger.log(
      `Émission notification ${notification.id} à tous les clients`,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    this.server.emit('nouvelle-notification', {
      notification,
      timestamp: new Date(),
    });
  }

  /**
   * Émettre une notification à un utilisateur spécifique
   */
  emitNotificationToUser(userId: string, notification: NotificationResource) {
    const sockets = this.userSockets.get(userId);

    if (!sockets || sockets.size === 0) {
      this.logger.warn(`Aucun socket connecté pour l'utilisateur ${userId}`);
      return;
    }

    this.logger.log(
      `Émission notification ${notification.id} à l'utilisateur ${userId} (${sockets.size} sockets)`,
    );

    sockets.forEach((socketId) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const socket = this.connectedClients.get(socketId);
      if (socket) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        socket.emit('nouvelle-notification', {
          notification,
          timestamp: new Date(),
        });
      }
    });
  }

  /**
   * Émettre le nombre de notifications non lues
   */
  emitNotificationsCount(count: number, userId?: string | null | undefined) {
    const data = {
      count,
      timestamp: new Date(),
    };

    if (userId) {
      // Envoyer à un utilisateur spécifique
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.forEach((socketId) => {
          const socket = this.connectedClients.get(socketId);
          if (socket) {
            socket.emit('notifications-count', data);
          }
        });
      }
    } else {
      // Broadcast à tous les clients
      this.server.emit('notifications-count', data);
    }
  }

  /**
   * Notification marquée comme lue
   */
  emitNotificationRead(notificationId: string, userId?: string | null) {
    const data = {
      notificationId,
      timestamp: new Date(),
    };

    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.forEach((socketId) => {
          const socket = this.connectedClients.get(socketId);
          if (socket) {
            socket.emit('notification-lue', data);
          }
        });
      }
    } else {
      this.server.emit('notification-lue', data);
    }
  }

  /**
   * Toutes les notifications marquées comme lues
   */
  emitAllNotificationsRead(userId?: string) {
    const data = {
      timestamp: new Date(),
    };

    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.forEach((socketId) => {
          const socket = this.connectedClients.get(socketId);
          if (socket) {
            socket.emit('toutes-notifications-lues', data);
          }
        });
      }
    } else {
      this.server.emit('toutes-notifications-lues', data);
    }
  }

  /**
   * Obtenir le nombre de clients connectés
   */
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  /**
   * Obtenir les statistiques de connexion
   */
  getConnectionStats() {
    return {
      totalClients: this.connectedClients.size,
      totalUsers: this.userSockets.size,
      userConnections: Array.from(this.userSockets.entries()).map(
        ([userId, sockets]) => ({
          userId,
          socketCount: sockets.size,
        }),
      ),
    };
  }
}
