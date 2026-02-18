import { ModePaiement } from '../enums/mode-paiement.enum';

/**
 * Interface pour l'objet de mode de paiement
 * Pour l'affichage dans le frontend
 */
export interface ModePaiementItem {
  value: ModePaiement;
  libelle: string;
  description?: string;
  icon?: string;
}

/**
 * Données statiques pour les modes de paiement
 * Utilisées pour l'affichage dans les formulaires frontend
 */
export const modesPaiementData: ModePaiementItem[] = [
  {
    value: ModePaiement.ESPECE,
    libelle: 'Espèces',
    description: 'Paiement en espèces',
    icon: '💵',
  },
  {
    value: ModePaiement.CHEQUE,
    libelle: 'Chèque',
    description: 'Paiement par chèque bancaire',
    icon: '📝',
  },
  {
    value: ModePaiement.VIREMENT,
    libelle: 'Virement bancaire',
    description: 'Virement bancaire',
    icon: '🏦',
  },
  {
    value: ModePaiement.CARTE_BANCAIRE,
    libelle: 'Carte bancaire',
    description: 'Paiement par carte bancaire',
    icon: '💳',
  },
  {
    value: ModePaiement.KIMBIYALA,
    libelle: 'Kimbiyala',
    description: 'Paiement mobile Kimbiyala',
    icon: '📱',
  },
];

/**
 * Fonction utilitaire pour obtenir le libellé d'un mode de paiement
 */
export function getModePaiementLibelle(value: ModePaiement): string {
  const item = modesPaiementData.find((m) => m.value === value);
  return item ? item.libelle : value;
}

/**
 * Fonction utilitaire pour obtenir la description d'un mode de paiement
 */
export function getModePaiementDescription(
  value: ModePaiement,
): string | undefined {
  const item = modesPaiementData.find((m) => m.value === value);
  return item?.description;
}

/**
 * Fonction utilitaire pour obtenir l'icône d'un mode de paiement
 */
export function getModePaiementIcon(value: ModePaiement): string | undefined {
  const item = modesPaiementData.find((m) => m.value === value);
  return item?.icon;
}
