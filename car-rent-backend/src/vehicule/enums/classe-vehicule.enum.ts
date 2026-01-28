import { registerEnumType } from '@nestjs/graphql';

export enum ClasseVehicule {
  TOURISTIQUE = 'TOURISTIQUE',
  UTILITAIRE = 'UTILITAIRE',
  HAUTE_GAMME = 'HAUTE_GAMME',
}

registerEnumType(ClasseVehicule, {
  name: 'ClasseVehicule',
  description: 'Classes de véhicules disponibles',
  valuesMap: {
    TOURISTIQUE: {
      description: 'Véhicule touristique',
    },
    UTILITAIRE: {
      description: 'Véhicule utilitaire',
    },
    HAUTE_GAMME: {
      description: 'Véhicule haute gamme',
    },
  },
});
