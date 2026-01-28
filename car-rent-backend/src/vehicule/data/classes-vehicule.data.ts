import { ClasseVehicule } from '../enums/classe-vehicule.enum';

/**
 * Interface pour l'objet de classe de véhicule
 * Pour l'affichage dans le frontend (pas stocké en base)
 */
export interface ClasseVehiculeItem {
  value: ClasseVehicule;
  libelle: string;
  description?: string;
}

/**
 * Données statiques pour les classes de véhicules
 * Utilisées uniquement pour l'affichage dans les formulaires frontend
 * La valeur stockée en base est l'ENUM directement (pas d'ID)
 */
export const classesVehiculeData: ClasseVehiculeItem[] = [
  {
    value: ClasseVehicule.TOURISTIQUE,
    libelle: 'Véhicule touristique',
    description: 'Véhicules légers pour usage personnel ou familial',
  },
  {
    value: ClasseVehicule.UTILITAIRE,
    libelle: 'Véhicule utilitaire',
    description:
      'Véhicules pour usage professionnel ou transport de marchandises',
  },
  {
    value: ClasseVehicule.HAUTE_GAMME,
    libelle: 'Véhicule haute gamme',
    description: 'Véhicules de luxe et prestige',
  },
];

/**
 * Fonction utilitaire pour obtenir le libellé d'une classe
 */
export function getClasseVehiculeLibelle(value: ClasseVehicule): string {
  const item = classesVehiculeData.find((c) => c.value === value);
  return item ? item.libelle : value;
}

/**
 * Fonction utilitaire pour obtenir la description d'une classe
 */
export function getClasseVehiculeDescription(
  value: ClasseVehicule,
): string | undefined {
  const item = classesVehiculeData.find((c) => c.value === value);
  return item?.description;
}
