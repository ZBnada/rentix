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
import { ModuleType } from '../enums/module-type.enum';
import { TypeNotification } from '../enums/type-notification.enum';
import { PrioriteNotification } from '../enums/priorite-notification.enum';

/**
 * Entité Notification - Système centralisé de notifications
 * Utilisé par tous les modules (Entretien, Assurance, Vignette, Contrôle Technique...)
 */
@Entity('notifications')
@Index(['lue', 'estActive'])
@Index(['vehiculeId', 'estActive'])
@Index(['module', 'estActive'])
@Index(['destinataire', 'lue'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ====== TYPE ET SOURCE ======
  @Column({
    type: 'enum',
    enum: ModuleType,
    comment: 'Module ayant généré la notification',
  })
  module: ModuleType;

  @Column({
    type: 'enum',
    enum: TypeNotification,
    comment: "Type de notification selon l'urgence",
  })
  type: TypeNotification;

  @Column({
    type: 'enum',
    enum: PrioriteNotification,
    default: PrioriteNotification.NORMALE,
    comment: 'Niveau de priorité',
  })
  priorite: PrioriteNotification | string;

  // ====== RÉFÉRENCE POLYMORPHE ======
  @Column({
    type: 'uuid',
    name: 'reference_id',
    comment: "ID de l'élément source (entretien, assurance, vignette...)",
  })
  referenceId: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'reference_type',
    nullable: true,
    comment: 'Type de référence pour polymorphisme',
  })
  referenceType: string | null;

  // ====== CONTENU ======
  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Titre de la notification',
  })
  titre: string;

  @Column({
    type: 'text',
    comment: 'Message détaillé de la notification',
  })
  message: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Icône à afficher (ex: bell, car, alert...)',
  })
  icone: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Couleur de la notification (ex: red, orange, blue...)',
  })
  couleur: string | null;

  // ====== VÉHICULE CONCERNÉ ======
  @Column({ type: 'uuid', name: 'vehicule_id', nullable: true })
  vehiculeId: string | null;

  @ManyToOne(() => Vehicule, { eager: false })
  @JoinColumn({ name: 'vehicule_id' })
  vehicule: Vehicule | null;

  // ====== ÉTAT DE LECTURE ======
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indique si la notification a été lue',
  })
  lue: boolean;

  @Column({
    type: 'timestamp',
    name: 'date_lecture',
    nullable: true,
    comment: 'Date et heure de lecture',
  })
  dateLecture: Date | null;

  // ====== DESTINATAIRE ======
  @Column({
    type: 'varchar',
    length: 100,
    name: 'destinataire',
    nullable: true,
    comment: 'Utilisateur destinataire (user ID ou email)',
  })
  destinataire: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'role_destinataire',
    nullable: true,
    comment: 'Rôle du destinataire (ADMIN, MECANICIEN, GESTIONNAIRE...)',
  })
  roleDestinataire: string | null;

  // ====== METADATA FLEXIBLE ======
  @Column({
    type: 'json',
    nullable: true,
    comment: 'Données supplémentaires spécifiques au module',
  })
  metadata: Record<string, any> | null;

  // ====== ACTION URL ======
  @Column({
    type: 'varchar',
    length: 500,
    name: 'action_url',
    nullable: true,
    comment: 'URL vers laquelle rediriger lors du clic',
  })
  actionUrl: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'action_label',
    nullable: true,
    comment: "Label du bouton d'action",
  })
  actionLabel: string | null;

  // ====== DATES ======
  @CreateDateColumn({ name: 'cree_le' })
  creeLe: Date;

  @UpdateDateColumn({ name: 'modifie_le' })
  modifieLe: Date;

  @Column({
    type: 'timestamp',
    name: 'expire_le',
    nullable: true,
    comment: "Date d'expiration de la notification",
  })
  expireLe: Date | null;

  // ====== ÉTAT GÉNÉRAL ======
  @Column({
    type: 'boolean',
    name: 'est_active',
    default: true,
    comment: 'Soft delete',
  })
  estActive: boolean;

  @Column({
    type: 'boolean',
    name: 'est_archivee',
    default: false,
    comment: 'Notification archivée',
  })
  estArchivee: boolean;

  // ====== TRACKING ======
  @Column({
    type: 'varchar',
    length: 100,
    name: 'cree_par',
    nullable: true,
    comment: 'Service/Module ayant créé la notification',
  })
  creePar: string | null;
}
