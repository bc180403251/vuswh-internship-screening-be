import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  OneToMany,
} from 'typeorm';
// import { Role } from './role.entity';
// import { Permission } from './permission.entity';
//   OneToOne,
// } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { Student } from './student.entity';
import { StudentRegistration } from './student_registrations.entity';
import { PhaseHistory } from './phase_history.entity';
import { EmailTemplate } from './email_template.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: false,
  })
  fullname: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: false,
  })
  phone: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ default: false })
  is_active: boolean;

  @Column({ default: false })
  is_validated: boolean;

  @Column({nullable:true})
  reset_pass_code: string;

  @Column({nullable:true})
  reset_till: Date;

  @Column({nullable:true})
  reset_code_upto: Date;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 1000,
    select: false,
    nullable:true
  })
  login_token: string;

  @Column({nullable:true})
  profile_pic: string;

  @CreateDateColumn({ default: null, name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ default: null, name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'archived_at',nullable:true })
  deleted_at: Date;

  @ManyToMany(() => Role, (role) => role.users, {
    onDelete: 'RESTRICT',
    // onUpdate: 'RESTRICT',
  })
  @JoinTable({ name: 'users_roles' })
  roles: Role[];

  @ManyToMany(() => Permission, (permission) => permission.users, {
    onDelete: 'RESTRICT',
    //onUpdate: 'RESTRICT',
  })
  @JoinTable({ name: 'users_permissions' })
  permissions: Permission[];

  @OneToOne(() => Student, (student) => student.user) // specify inverse side as a second parameter
  student: Student;

  @OneToMany(
    () => StudentRegistration,
    (studentregistration) => studentregistration.processed_by,
  )
  studentregistrations: StudentRegistration[];

  @OneToMany(() => PhaseHistory, (PhaseHistory) => PhaseHistory.processed_by)
  phaseHistory: PhaseHistory[];

  @OneToMany(() => EmailTemplate, (emailTemplate) => emailTemplate.createdby)
  emailtemplate: EmailTemplate[];
}
