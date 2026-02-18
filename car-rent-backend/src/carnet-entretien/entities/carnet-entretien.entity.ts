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

@Entity('carnet_entretiens')
export class CarnetEntretien {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36, name: 'vehicule_id' })
  vehiculeId: string;

  @ManyToOne(() => Vehicule, { eager: false })
  @JoinColumn({ name: 'vehicule_id' })
  vehicule: Vehicule;

  @Column({ type: 'varchar', length: 36, name: 'type_entretien_id' })
  typeEntretienId: string;

  @ManyToOne(() => TypeEntretien, { eager: true })
  @JoinColumn({ name: 'type_entretien_id' })
  typeEntretien: TypeEntretien;

  @Column({ type: 'timestamp', name: 'date_debut' })
  dateDebut: Date;

  @Column({ type: 'timestamp', name: 'date_fin', nullable: true })
  dateFin: Date | null;

  @Column({ type: 'int', name: 'kilometrage_debut', default: 0 })
  kilometrageDebut: number;

  @Column({ type: 'int', name: 'kilometrage_fin', nullable: true })
  kilometrageFin: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    name: 'cout_estime',
    default: 0,
  })
  coutEstime: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    name: 'cout_reel',
    nullable: true,
  })
  coutReel: number | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'statut',
    default: 'EN_ATTENTE',
  })
  statut: string;

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
