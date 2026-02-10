import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Vehicule } from '../../vehicule/entities/vehicule.entity';
import { TypeEntretien } from '../../type-entretien/entities/type-entretien.entity';

@Entity('entretiens_a_suivre')
@Index(['vehiculeId', 'typeEntretienId'], { unique: true })
export class EntretienASuivre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'vehicule_id' })
  vehiculeId: string;

  @ManyToOne(() => Vehicule, { eager: false })
  @JoinColumn({ name: 'vehicule_id' })
  vehicule: Vehicule;

  @Column({ type: 'uuid', name: 'type_entretien_id' })
  typeEntretienId: string;

  @ManyToOne(() => TypeEntretien, { eager: true })
  @JoinColumn({ name: 'type_entretien_id' })
  typeEntretien: TypeEntretien;

  @Column({ type: 'boolean', name: 'est_active', default: true })
  estActive: boolean;

  @CreateDateColumn({ name: 'saisi_le' })
  saisiLe: Date;

  @UpdateDateColumn({ name: 'modifie_le' })
  modifieLe: Date;

  @Column({ type: 'boolean', name: 'est_actif', default: true })
  estActif: boolean;
}
