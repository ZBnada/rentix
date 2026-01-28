import { registerEnumType } from '@nestjs/graphql';

/**
 * Énumération des types d'énergie pour les véhicules
 */
export enum EnergieType {
  ESSENCE = 'ESSENCE',
  DIESEL = 'DIESEL',
  GPL = 'GPL',
  ELECTRIQUE = 'ELECTRIQUE',
  HYBRIDE = 'HYBRIDE',
}

// Enregistrement de l'enum pour GraphQL
registerEnumType(EnergieType, {
  name: 'EnergieType',
  description: "Types d'énergie disponibles pour les véhicules",
  valuesMap: {
    ESSENCE: {
      description: 'Véhicule essence',
    },
    DIESEL: {
      description: 'Véhicule diesel',
    },
    GPL: {
      description: 'Véhicule GPL',
    },
    ELECTRIQUE: {
      description: 'Véhicule électrique',
    },
    HYBRIDE: {
      description: 'Véhicule hybride',
    },
  },
});
