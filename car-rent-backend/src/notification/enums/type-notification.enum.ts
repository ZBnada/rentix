import { registerEnumType } from '@nestjs/graphql';

/**
 * Types de notifications selon l'urgence
 */
export enum TypeNotification {
  INFO = 'INFO', // Information générale
  PROCHE = 'PROCHE', // Échéance proche (7 jours)
  IMMINENTE = 'IMMINENTE', // Échéance imminente (1-2 jours)
  RETARD = 'RETARD', // En retard (date dépassée)
  EXPIRE = 'EXPIRE', // Expiré (assurance, vignette...)
  ALERTE = 'ALERTE', // Alerte importante
  URGENT = 'URGENT', // Action urgente requise
}

// Enregistrement pour GraphQL
registerEnumType(TypeNotification, {
  name: 'TypeNotification',
  description: "Type de notification selon l'urgence",
  valuesMap: {
    INFO: {
      description: 'Information générale',
    },
    PROCHE: {
      description: 'Échéance proche (7 jours avant)',
    },
    IMMINENTE: {
      description: 'Échéance imminente (1-2 jours avant)',
    },
    RETARD: {
      description: 'En retard (date dépassée)',
    },
    EXPIRE: {
      description: 'Document expiré',
    },
    ALERTE: {
      description: 'Alerte importante',
    },
    URGENT: {
      description: 'Action urgente requise',
    },
  },
});
