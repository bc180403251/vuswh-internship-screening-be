import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { degrees } from './degree.entity';
import { User } from './user.entity';
import { StudentRegistration } from './student_registrations.entity';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
// import { student_registration } from './student_registrations.entity';

@Entity({ name: 'students' })
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    unique: true,
  })
  vuid: string;

  @IsNotEmpty()
  @IsString()
  @Column({
    type: 'varchar',
    length: 30,
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    unique: false,
  })
  cnic: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: false,
  })
  phone: string;

  @DeleteDateColumn({ name: 'archived_at' })
  deleted_at: Date;

  //establish raltion between degree and student
  @ManyToOne(() => degrees, (degree) => degree.students)
  degree: degrees;

  @OneToOne(() => User, (user) => user.student)
  @JoinColumn()
  user: User;

  @OneToMany(() => StudentRegistration, (registration) => registration.student)
  studentregistrations: StudentRegistration[];
}
