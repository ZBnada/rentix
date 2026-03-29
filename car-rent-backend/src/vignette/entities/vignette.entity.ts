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
import { LigneReglementVignette } from './ligne-reglement.entity';
import { StatutVignette } from '../enums/statut-vignette.enum';

@Entity('vignettes')
export class Vignette {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'vehicule_id' })
  vehiculeId: string;

  @ManyToOne(() => Vehicule, { eager: true })
  @JoinColumn({ name: 'vehicule_id' })
  vehicule: Vehicule;

  @Column({ type: 'varchar', length: 50, name: 'matricule_vehicule' })
  matriculeVehicule: string;

  @Column({ type: 'date', name: 'date_fin_validite' })
  dateFinValidite: Date;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  montant: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 3,
    name: 'montant_reste',
    default: 0,
  })
  montantReste: number;

  @Column({ type: 'date', name: 'date_operation' })
  dateOperation: Date;

  @Column({ type: 'int', name: 'numero_fiche', default: 0 })
  numeroFiche: number;

  @Column({
    type: 'enum',
    enum: StatutVignette,
    default: StatutVignette.BROUILLON,
  })
  statut: StatutVignette;

  @OneToMany(() => LigneReglementVignette, (ligne) => ligne.vignette, {
    cascade: true,
  })
  lignesReglement: LigneReglementVignette[];

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
