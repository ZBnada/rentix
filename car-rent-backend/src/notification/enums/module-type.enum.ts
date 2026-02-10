import { registerEnumType } from '@nestjs/graphql';

/**
 * Types de modules pouvant générer des notifications
 */
export enum ModuleType {
  ENTRETIEN = 'ENTRETIEN',
  ASSURANCE = 'ASSURANCE',
  VIGNETTE = 'VIGNETTE',
  CONTROLE_TECHNIQUE = 'CONTROLE_TECHNIQUE',
  REVISION = 'REVISION',
  REPARATION = 'REPARATION',
}

// Enregistrement pour GraphQL
registerEnumType(ModuleType, {
  name: 'ModuleType',
  description: 'Type de module ayant généré la notification',
  valuesMap: {
    ENTRETIEN: {
      description: 'Notification liée à un entretien',
    },
    ASSURANCE: {
      description: 'Notification liée à une assurance',
    },
    VIGNETTE: {
      description: 'Notification liée à une vignette',
    },
    CONTROLE_TECHNIQUE: {
      description: 'Notification liée au contrôle technique',
    },
    REVISION: {
      description: 'Notification liée à une révision',
    },
    REPARATION: {
      description: 'Notification liée à une réparation',
    },
  },
});
