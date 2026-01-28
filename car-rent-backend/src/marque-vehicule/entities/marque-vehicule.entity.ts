import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Vehicule } from '../../vehicule/entities/vehicule.entity';

/**
 * Entité MarqueVehicule
 * Représente une marque de véhicule dans le système
 */
@Entity('marques_vehicule')
export class MarqueVehicule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  libelle: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'logo_url' })
  logoUrl?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', name: 'est_actif', default: true })
  estActif: boolean;

  // Relation One-to-Many avec Vehicule
  @OneToMany(() => Vehicule, (vehicule) => vehicule.marque)
  vehicules?: Vehicule[];
}
