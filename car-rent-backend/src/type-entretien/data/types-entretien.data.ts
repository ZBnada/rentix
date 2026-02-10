import { CreateTypeEntretienInput } from '../dto/create-type-entretien.input';

/**
 * Données pré-définies pour les types d'entretien
 * Basées sur l'image 1 fournie (Liste des entretiens)
 */
export const typesEntretienData: CreateTypeEntretienInput[] = [
  {
    codeEntretien: 'E01',
    designation: 'Vidange et changement filtre à huile',
    description: "Remplacement de l'huile moteur et du filtre à huile",
    frequenceJoursRecommandee: 180, // 6 mois
    frequenceKmRecommandee: 5000,
    coutMoyenEstime: 150.0,
    estObligatoire: false,
  },
  {
    codeEntretien: 'E02',
    designation: 'Changement filtre à carburant',
    description: 'Remplacement du filtre à carburant',
    frequenceJoursRecommandee: 365, // 1 an
    frequenceKmRecommandee: 20000,
    coutMoyenEstime: 80.0,
    estObligatoire: false,
  },
  {
    codeEntretien: 'E03',
    designation: 'Changement filtre à air',
    description: 'Remplacement du filtre à air',
    frequenceJoursRecommandee: 180, // 6 mois
    frequenceKmRecommandee: 15000,
    coutMoyenEstime: 50.0,
    estObligatoire: false,
  },
  {
    codeEntretien: 'E04',
    designation: 'Changement courroie de distribution',
    description: 'Remplacement de la courroie de distribution',
    frequenceJoursRecommandee: 1825, // 5 ans
    frequenceKmRecommandee: 100000,
    coutMoyenEstime: 500.0,
    estObligatoire: false,
  },
  {
    codeEntretien: 'E05',
    designation: 'Changement roues',
    description: 'Remplacement des pneus',
    frequenceJoursRecommandee: 730, // 2 ans
    frequenceKmRecommandee: 40000,
    coutMoyenEstime: 400.0,
    estObligatoire: false,
  },
  {
    codeEntretien: 'E06',
    designation: 'Changement bougies',
    description: "Remplacement des bougies d'allumage",
    frequenceJoursRecommandee: 365, // 1 an
    frequenceKmRecommandee: 30000,
    coutMoyenEstime: 120.0,
    estObligatoire: false,
  },
  {
    codeEntretien: 'E07',
    designation: 'Révision générale',
    description: 'Révision complète du véhicule',
    frequenceJoursRecommandee: 365, // 1 an
    frequenceKmRecommandee: 15000,
    coutMoyenEstime: 300.0,
    estObligatoire: false,
  },
  {
    codeEntretien: 'E08',
    designation: 'Contrôle technique',
    description: 'Contrôle technique obligatoire',
    frequenceJoursRecommandee: 365, // 1 an
    frequenceKmRecommandee: null,
    coutMoyenEstime: 50.0,
    estObligatoire: true,
  },
  {
    codeEntretien: 'E09',
    designation: 'Changement plaquettes de frein',
    description: 'Remplacement des plaquettes de frein',
    frequenceJoursRecommandee: 365, // 1 an
    frequenceKmRecommandee: 30000,
    coutMoyenEstime: 200.0,
    estObligatoire: false,
  },
  {
    codeEntretien: 'E10',
    designation: 'Vidange liquide de refroidissement',
    description: 'Remplacement du liquide de refroidissement',
    frequenceJoursRecommandee: 730, // 2 ans
    frequenceKmRecommandee: 40000,
    coutMoyenEstime: 100.0,
    estObligatoire: false,
  },
];
