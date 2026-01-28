import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MarqueVehicule } from '../../marque-vehicule/entities/marque-vehicule.entity';
import { EnergieType } from '../enums/energie.enum';
import { ClasseVehicule } from '../enums/classe-vehicule.enum';

/**
 * Entité Véhicule
 * Représente un véhicule dans le système de location
 */
@Entity('vehicules')
export class Vehicule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  matricule: string;

  @Column({ type: 'uuid', name: 'marque_id' })
  marqueId: string;

  @ManyToOne(() => MarqueVehicule, { eager: true })
  @JoinColumn({ name: 'marque_id' })
  marque: MarqueVehicule;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'datetime', name: 'date_premiere_mise_en_circulation' })
  datePremiereMiseEnCirculation: Date;

  @Column({ type: 'int', default: 0 })
  puissance: number;

  @Column({
    type: 'enum',
    enum: EnergieType,
    default: EnergieType.ESSENCE,
  })
  energie: EnergieType;

  @Column({ type: 'int', default: 0 })
  compteur: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  couleur: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    name: 'prix_achat',
    default: 0,
  })
  prixAchat: number;

  @Column({
    type: 'enum',
    enum: ClasseVehicule,
    name: 'classe_vehicule',
    default: ClasseVehicule.TOURISTIQUE,
  })
  classeVehicule: ClasseVehicule;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    name: 'prix_location_journee',
    default: 0,
  })
  prixLocationJournee: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    name: 'prix_heure_retard',
    default: 0,
  })
  prixHeureRetard: number;

  @Column({ type: 'boolean', name: 'roue_secours', default: false })
  roueSecours: boolean;

  @Column({ type: 'boolean', name: 'cric_manivelle', default: false })
  cricManivelle: boolean;

  @Column({ type: 'boolean', name: 'jeu_housse', default: false })
  jeuHousse: boolean;

  @Column({ type: 'boolean', name: 'siege_bebe', default: false })
  siegeBebe: boolean;

  @Column({ type: 'boolean', name: 'jeu_tapis', default: false })
  jeuTapis: boolean;

  @Column({ type: 'boolean', name: 'poste_radio', default: false })
  posteRadio: boolean;

  @Column({ type: 'boolean', name: 'jeu_enjoliveurs', default: false })
  jeuEnjoliveurs: boolean;

  @Column({ type: 'text', nullable: true })
  observations: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string | null;

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
