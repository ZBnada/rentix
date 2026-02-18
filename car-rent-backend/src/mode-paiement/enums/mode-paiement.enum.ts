import { registerEnumType } from '@nestjs/graphql';

/**
 * Énumération des modes de paiement
 */
export enum ModePaiement {
  ESPECE = 'ESPECE',
  CHEQUE = 'CHEQUE',
  VIREMENT = 'VIREMENT',
  CARTE_BANCAIRE = 'CARTE_BANCAIRE',
  KIMBIYALA = 'KIMBIYALA',
}

// Enregistrement de l'enum pour GraphQL
registerEnumType(ModePaiement, {
  name: 'ModePaiement',
  description: 'Modes de paiement disponibles',
  valuesMap: {
    ESPECE: {
      description: 'Paiement en espèces',
    },
    CHEQUE: {
      description: 'Paiement par chèque',
    },
    VIREMENT: {
      description: 'Paiement par virement bancaire',
    },
    CARTE_BANCAIRE: {
      description: 'Paiement par carte bancaire',
    },
  },
});
