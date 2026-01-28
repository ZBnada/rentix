import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

export enum UserType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ length: 10, default: '+216' })
  countryCodePhone: string;

  @Column({ length: 20 })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.INDIVIDUAL,
  })
  userType: UserType;

  @Column({ length: 255, nullable: true })
  legalCompanyName: string;

  @Column({ length: 100, nullable: true })
  countryOfRegistration: string;

  @Column({ type: 'text', nullable: true })
  streetAddress: string;

  @Column({ length: 50, nullable: true })
  houseNumber: string;

  @Column({ length: 20, nullable: true })
  zipCode: string;

  @Column({ length: 100, nullable: true })
  city: string;

  /**
   * Profile Image URL
   * Stores the relative path or full URL to the user's profile image
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  profileImage: string | null;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date | null;

  @Column({ length: 255, nullable: true })
  googleId: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @Column({ length: 255, nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column()
  roleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Helper method to get user initials for avatar fallback
   * Example: John Doe -> "JD"
   */
  getInitials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  }

  /**
   * Helper method to get full profile image URL
   */
  getProfileImageUrl(baseUrl: string): string | null {
    if (!this.profileImage) {
      return null;
    }

    if (
      this.profileImage.startsWith('http://') ||
      this.profileImage.startsWith('https://')
    ) {
      return this.profileImage;
    }

    return `${baseUrl}${this.profileImage}`;
  }
}
