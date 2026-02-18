import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Vehicule } from '../../vehicule/entities/vehicule.entity';
import { AssuranceReglement } from './assurance-reglement.entity';

/**
 * Entité Assurance
 * Représente une assurance de véhicule dans le système
 */
@Entity('assurances')
export class Assurance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'vehicule_id' })
  vehiculeId: string;

  @ManyToOne(() => Vehicule, { eager: true })
  @JoinColumn({ name: 'vehicule_id' })
  vehicule: Vehicule;

  @Column({ type: 'varchar', length: 200 })
  prestataire: string;

  @Column({ type: 'date', name: 'date_debut' })
  dateDebut: Date;

  @Column({ type: 'date', name: 'date_fin_validite' })
  dateFinValidite: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    name: 'montant_total',
    default: 0,
  })
  montantTotal: number;

  @Column({ type: 'date', name: 'date_operation' })
  dateOperation: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'numero_police',
  })
  numeroPolice?: string;

  @Column({ type: 'text', nullable: true })
  observations?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'document_url',
  })
  documentUrl: string | null;

  // Relation One-to-Many avec AssuranceReglement
  @OneToMany(() => AssuranceReglement, (reglement) => reglement.assurance, {
    cascade: true,
  })
  reglements: AssuranceReglement[];

  @Column({ type: 'varchar', length: 100, name: 'saisi_par', nullable: true })
  saisiPar?: string;

  @Column({ type: 'varchar', length: 100, name: 'modifie_par', nullable: true })
  modifiePar?: string;

  @CreateDateColumn({ name: 'saisi_le' })
  saisiLe: Date;

  @UpdateDateColumn({ name: 'modifie_le' })
  modifieLe: Date;

  @Column({ type: 'boolean', name: 'est_actif', default: true })
  estActif: boolean;
}
