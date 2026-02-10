import { registerEnumType } from '@nestjs/graphql';

/**
 * Priorité d'une notification
 */
export enum PrioriteNotification {
  BASSE = 'BASSE',
  NORMALE = 'NORMALE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE',
  CRITIQUE = 'CRITIQUE',
}

// Enregistrement pour GraphQL
registerEnumType(PrioriteNotification, {
  name: 'PrioriteNotification',
  description: 'Niveau de priorité de la notification',
  valuesMap: {
    BASSE: {
      description: 'Priorité basse - Information',
    },
    NORMALE: {
      description: 'Priorité normale - À traiter normalement',
    },
    HAUTE: {
      description: 'Priorité haute - Nécessite attention',
    },
    URGENTE: {
      description: 'Priorité urgente - Action rapide requise',
    },
    CRITIQUE: {
      description: 'Priorité critique - Action immédiate impérative',
    },
  },
});
