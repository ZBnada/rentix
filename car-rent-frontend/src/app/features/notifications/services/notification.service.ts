// src/app/features/notifications/services/notification.service.ts
// VERSION PRODUCTION - SANS LOGS

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Notification } from '../models/notification.model';

/**
 * Service GraphQL pour les notifications
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly graphqlUrl = 'http://localhost:3000/graphql';

  /**
   * Exécuter une query/mutation GraphQL
   */
  private executeGraphQL<T>(query: string, variables?: any): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query,
      variables: variables || {},
    };

    return this.http.post<{ data: T; errors?: any[] }>(this.graphqlUrl, body, { headers }).pipe(
        map(response => {
          if (response.errors && response.errors.length > 0) {
            throw new Error(response.errors[0].message);
          }
          return response.data;
        }),
        catchError(error => {
          console.error('GraphQL Error:', error);
          throw error;
        })
    );
  }

  /**
   * RÉCUPÉRER LES NOTIFICATIONS NON LUES
   */
  getUnreadNotifications(recipient?: string): Observable<Notification[]> {
    const query = `
      query GetUnreadNotifications {
        notificationsNonLues {
          id
          module
          type
          priorite
          referenceId
          titre
          message
          icone
          couleur
          lue
          dateLecture
          creeLe
          vehicule {
            id
            matricule
          }
        }
      }
    `;

    return this.executeGraphQL<{ notificationsNonLues: any[] }>(query).pipe(
        map(result => {
          const rawNotifications = result.notificationsNonLues || [];

          return rawNotifications.map(n => ({
            id: n.id,
            module: n.module,
            type: n.type,
            priority: n.priorite,
            referenceId: n.referenceId || '',
            referenceType: null,
            title: n.titre,
            message: n.message,
            icon: n.icone || null,
            color: n.couleur || null,
            vehicleId: n.vehiculeId || null,
            vehicle: n.vehicule ? {
              id: n.vehicule.id,
              registrationNumber: n.vehicule.matricule,
              brand: n.vehicule.marque ? { name: n.vehicule.marque.libelle } : undefined,
            } : null,
            isRead: n.lue === true,
            readAt: n.dateLecture ? new Date(n.dateLecture) : null,
            recipient: n.destinataire || null,
            recipientRole: null,
            metadata: null,
            actionUrl: n.actionUrl || null,
            actionLabel: n.actionLabel || null,
            createdAt: new Date(n.creeLe),
            updatedAt: new Date(n.modifieLe || n.creeLe),
            expiresAt: n.expireLe ? new Date(n.expireLe) : null,
            isActive: true,
            isArchived: false,
            createdBy: null,
          } as Notification));
        })
    );
  }

  /**
   * MARQUER COMME LUE
   */
  markAsRead(notificationId: string): Observable<Notification> {
    const mutation = `
      mutation MarkAsRead($id: String!) {
        marquerNotificationCommeLue(id: $id) {
          id
          lue
          dateLecture
        }
      }
    `;

    return this.executeGraphQL<{ marquerNotificationCommeLue: any }>(mutation, { id: notificationId }).pipe(
        map(result => result.marquerNotificationCommeLue as Notification)
    );
  }

  /**
   * MARQUER TOUTES COMME LUES
   */
  markAllAsRead(recipient?: string): Observable<number> {
    const mutation = `
      mutation MarkAllAsRead {
        marquerToutesNotificationsCommeLues
      }
    `;

    return this.executeGraphQL<{ marquerToutesNotificationsCommeLues: number }>(mutation).pipe(
        map(result => result.marquerToutesNotificationsCommeLues)
    );
  }

  /**
   * SUPPRIMER UNE NOTIFICATION
   */
  deleteNotification(notificationId: string): Observable<boolean> {
    const mutation = `
      mutation DeleteNotification($id: String!) {
        supprimerNotification(id: $id)
      }
    `;

    return this.executeGraphQL<{ supprimerNotification: boolean }>(mutation, { id: notificationId }).pipe(
        map(result => result.supprimerNotification)
    );
  }

  /**
   * COMPTER LES NON LUES
   */
  countUnreadNotifications(recipient?: string): Observable<number> {
    const query = `
      query GetUnreadCount {
        countNotificationsNonLues
      }
    `;

    return this.executeGraphQL<{ countNotificationsNonLues: number }>(query).pipe(
        map(result => result.countNotificationsNonLues)
    );
  }
}