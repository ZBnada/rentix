import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entité TypeEntretien
 * Table de référence pour les types d'entretien (E01, E02, E03...)
 * Correspond à la "Liste des entretiens" (Image 1)
 */
@Entity('types_entretien')
export class TypeEntretien {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'code_entretien' })
  codeEntretien: string; // E01, E02, E03...

  @Column({ type: 'varchar', length: 255 })
  designation: string; // Vidange et changement filtre à huile

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', name: 'frequence_jours_recommandee', nullable: true })
  frequenceJoursRecommandee: number | null; // Ex: 180 jours (6 mois)

  @Column({ type: 'int', name: 'frequence_km_recommandee', nullable: true })
  frequenceKmRecommandee: number | null; // Ex: 5000 km

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    name: 'cout_moyen_estime',
    default: 0,
  })
  coutMoyenEstime: number; // Coût moyen pour ce type d'entretien

  @Column({ type: 'boolean', name: 'est_obligatoire', default: false })
  estObligatoire: boolean; // Entretien obligatoire par la loi ?

  @Column({ type: 'varchar', length: 100, name: 'saisi_par', nullable: true })
  saisiPar: string | null;

  @Column({ type: 'varchar', length: 100, name: 'modifie_par', nullable: true })
  modifiePar: string | null;

  @CreateDateColumn({ name: 'saisi_le' })
  saisiLe: Date;

  @UpdateDateColumn({ name: 'modifie_le' })
  modifieLe: Date;

  @Column({ type: 'boolean', name: 'est_actif', default: true })
  estActif: boolean;
}
