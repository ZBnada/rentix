import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicule } from '../../vehicule/entities/vehicule.entity';
import { TypeEntretien } from '../../type-entretien/entities/type-entretien.entity';

/**
 * Entité Entretien - Carnet d'entretien des véhicules
 * Représente un entretien EFFECTUÉ sur un véhicule (HISTORIQUE)
 */
@Entity('entretiens')
export class Entretien {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ====== RELATION VERS TypeEntretien ======
  @Column({ type: 'uuid', name: 'type_entretien_id' })
  typeEntretienId: string;

  @ManyToOne(() => TypeEntretien, { eager: true })
  @JoinColumn({ name: 'type_entretien_id' })
  typeEntretien: TypeEntretien;
  // ===================================================

  // ====== RELATION VERS Vehicule ======
  @Column({ type: 'uuid', name: 'vehicule_id' })
  vehiculeId: string;

  @ManyToOne(() => Vehicule, { eager: true })
  @JoinColumn({ name: 'vehicule_id' })
  vehicule: Vehicule;
  // ====================================

  @Column({ type: 'date', name: 'date_debut_operation' })
  dateDebutOperation: Date;

  @Column({ type: 'date', name: 'date_fin_operation' })
  dateFinOperation: Date;

  @Column({ type: 'int', name: 'kilometrage_arret', default: 0 })
  kilometrageArret: number;

  @Column({
    type: 'int',
    name: 'kilometrage_limite_prochain_entretien',
    nullable: true,
  })
  kilometrageLimiteProchainEntretien: number | null;

  @Column({
    type: 'date',
    name: 'date_limite_prochain_entretien',
    nullable: true,
  })
  dateLimiteProchainEntretien: Date | null;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'code_personnel',
    nullable: true,
  })
  codePersonnel: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'nom_prenom_personnel',
    nullable: true,
  })
  nomPrenomPersonnel: string | null;

  @Column({ type: 'text', nullable: true })
  observations: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    name: 'cout_total',
    default: 0,
  })
  coutTotal: number;

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

  @Column({ type: 'varchar', length: 50, name: 'etat', default: 'TERMINE' })
  etat: string;
}
