import { registerEnumType } from '@nestjs/graphql';

export enum StatutVignette {
  BROUILLON = 'BROUILLON',
  VALIDE = 'VALIDE',
  ANNULE = 'ANNULE',
}

registerEnumType(StatutVignette, {
  name: 'StatutVignette',
  description: 'Statuts possibles pour une vignette',
});
