import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  name: string;

  @IsBoolean()
  @Column({
    default: false,
  })
  is_default: boolean;

  // @IsDateString()
  @CreateDateColumn({default: null, name: 'created_at' })
  created_at: Date;

  // @IsDateString()
  @UpdateDateColumn({default: null, name: 'updated_at' })
  updated_at: Date;

  // @IsDateString()
  @DeleteDateColumn({ name: 'archived_at' })
  deleted_at: Date;

  @ManyToMany(() => User, (user) => user.roles, {
    onDelete: 'RESTRICT',
    //onUpdate: 'RESTRICT',
  })
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinTable({ name : 'roles_permissions'})
  permissions: Permission[];
}
