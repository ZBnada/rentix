import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModePaiement } from '../enums/mode-paiement.enum';

/**
 * Entité ModePaiementEntity
 * Représente un mode de paiement configuré dans le système
 */
@Entity('modes_paiement')
export class ModePaiementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ModePaiement,
    unique: true,
  })
  type: ModePaiement;

  @Column({ type: 'varchar', length: 100 })
  libelle: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  icon?: string;

  @Column({ type: 'boolean', name: 'est_actif', default: true })
  estActif: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
