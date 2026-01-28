import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Field, ID, Int } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@Entity('roles')
export class Role {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true, length: 50 })
  name: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 60 })
  weight: number; // Plus le poids est bas, plus le pouvoir est élevé (admin=0, client=60)

  @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
