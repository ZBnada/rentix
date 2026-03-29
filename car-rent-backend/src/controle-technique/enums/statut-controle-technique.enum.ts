import { registerEnumType } from '@nestjs/graphql';

export enum StatutControleTechnique {
  BROUILLON = 'BROUILLON',
  VALIDE = 'VALIDE',
  ANNULE = 'ANNULE',
}

registerEnumType(StatutControleTechnique, {
  name: 'StatutControleTechnique',
  description: 'Statut du contrôle technique',
});
