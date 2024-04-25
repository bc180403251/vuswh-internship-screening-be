import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
  TreeParent,
  TreeChildren,
  Tree,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'permissions' })
@Tree('nested-set')
export class Permission {
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

  // @IsDateString()
  @CreateDateColumn({default: null, name: 'created_at' })
  created_at: Date;

  // @IsDateString()
  @UpdateDateColumn({default: null, name: 'updated_at' })
  updated_at: Date;

  // @IsDateString()
  @DeleteDateColumn({ name: 'archived_at' })
  deleted_at: Date;

  @ManyToMany(() => User, (user) => user.permissions, {
    onDelete: 'RESTRICT',
    //    onUpdate: 'RESTRICT',
  })
  users: User[];

  @ManyToMany(() => Role, (role) => role.permissions, {
    onDelete: 'RESTRICT',
    //  onUpdate: 'RESTRICT',
  })
  roles: Role[];
  // child: Permission[];

  // @ManyToOne(() => Permission, (permission) => permission.children, {
  //   // nullable: true,
  // })
  @TreeParent()
  parent: Permission;

  // @OneToMany(() => Permission, (permission) => permission.parent)
  @TreeChildren()
  children: Permission[];

  @Column()
  action: boolean;
}
// function OneToMany(
//   arg0: () => typeof Permission,
//   arg1: (permission: any) => any,
// ): (target: Permission, propertyKey: 'children') => void {
//   throw new Error('Function not implemented.');
// }
