import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ControleTechnique } from './controle-technique.entity';
import { ModePaiementEntity } from '../../mode-paiement/entities/mode-paiement.entity';

@Entity('ligne_reglement_controle_technique')
export class LigneReglementControleTechnique {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'controle_technique_id' })
  controleTechniqueId: string;

  @ManyToOne(() => ControleTechnique, (ct) => ct.lignesReglement, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'controle_technique_id' })
  controleTechnique: ControleTechnique;

  @Column({ type: 'uuid', name: 'mode_paiement_id' })
  modePaiementId: string;

  @ManyToOne(() => ModePaiementEntity, { eager: true })
  @JoinColumn({ name: 'mode_paiement_id' })
  modePaiement: ModePaiementEntity;

  @Column({ type: 'varchar', length: 200, nullable: true })
  designation?: string;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  montant: number;

  @Column({ type: 'date', nullable: true })
  echeance?: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'reference_piece',
  })
  referencePiece?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  banque?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  porteur?: string;

  @Column({ type: 'date', name: 'date_operation' })
  dateOperation: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'boolean', name: 'est_actif', default: true })
  estActif: boolean;
}
