import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Assurance } from './assurance.entity';
import { ModePaiementEntity } from '../../mode-paiement/entities/mode-paiement.entity';

/**
 * Entité AssuranceReglement
 * Représente un détail de règlement pour une assurance
 */
@Entity('assurance_reglements')
export class AssuranceReglement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'assurance_id' })
  assuranceId: string;

  @ManyToOne(() => Assurance, (assurance) => assurance.reglements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assurance_id' })
  assurance: Assurance;

  @Column({ type: 'uuid', name: 'mode_paiement_id' })
  modePaiementId: string;

  @ManyToOne(() => ModePaiementEntity, { eager: true })
  @JoinColumn({ name: 'mode_paiement_id' })
  modePaiement: ModePaiementEntity;

  @Column({ type: 'varchar', length: 200, nullable: true })
  designation?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    default: 0,
  })
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
