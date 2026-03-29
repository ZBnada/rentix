import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatutControleTechnique } from '../enums/statut-controle-technique.enum';
import { Vehicule } from '../../vehicule/entities/vehicule.entity';
import { LigneReglementControleTechnique } from './ligne-reglement-controle-technique.entity';

@Entity('controle_technique')
export class ControleTechnique {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'vehicule_id' })
  vehiculeId: string;

  @ManyToOne(() => Vehicule, { eager: false })
  @JoinColumn({ name: 'vehicule_id' })
  vehicule: Vehicule;

  @Column({ name: 'matricule_vehicule' })
  matriculeVehicule: string;

  @Column({ name: 'numero_fiche', type: 'int', unsigned: true, default: 0 })
  numeroFiche: number;

  @Column({ name: 'date_fin_validite', type: 'date' })
  dateFinValidite: Date;

  @Column('decimal', { precision: 15, scale: 3, default: 0 })
  montant: number;

  @Column('decimal', {
    name: 'montant_reste',
    precision: 15,
    scale: 3,
    default: 0,
  })
  montantReste: number;

  @Column({ name: 'date_operation', type: 'date' })
  dateOperation: Date;

  @Column({
    type: 'enum',
    enum: StatutControleTechnique,
    default: StatutControleTechnique.BROUILLON,
  })
  statut: StatutControleTechnique;

  @OneToMany(
    () => LigneReglementControleTechnique,
    (l) => l.controleTechnique,
    { cascade: true, eager: false },
  )
  lignesReglement: LigneReglementControleTechnique[];

  @Column({ name: 'saisi_par', nullable: true })
  saisiPar: string;

  @Column({ name: 'modifie_par', nullable: true })
  modifiePar: string;

  @Column({ name: 'valide_par', nullable: true })
  validePar: string;

  @Column({ name: 'annule_par', nullable: true })
  annulePar: string;

  @Column({ name: 'est_actif', default: true })
  estActif: boolean;

  @CreateDateColumn({ name: 'saisi_le' })
  saisiLe: Date;

  @UpdateDateColumn({ name: 'modifie_le' })
  modifieLe: Date;
}
