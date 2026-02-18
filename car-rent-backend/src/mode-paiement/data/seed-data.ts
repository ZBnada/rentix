import { CreateModePaiementInput } from '../dto/create-mode-paiement.input';
import { ModePaiement } from '../enums/mode-paiement.enum';

/**
 * Données pré-définies pour les modes de paiement
 * Ces données seront chargées automatiquement au démarrage
 */
export const modesPaiementSeed: CreateModePaiementInput[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    type: ModePaiement.ESPECE,
    libelle: 'Espèces',
    description: 'Paiement en espèces',
    icon: '💵',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    type: ModePaiement.CHEQUE,
    libelle: 'Chèque',
    description: 'Paiement par chèque bancaire',
    icon: '📝',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    type: ModePaiement.VIREMENT,
    libelle: 'Virement bancaire',
    description: 'Virement bancaire',
    icon: '🏦',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-def1-234567890123',
    type: ModePaiement.CARTE_BANCAIRE,
    libelle: 'Carte bancaire',
    description: 'Paiement par carte bancaire',
    icon: '💳',
  },
];
