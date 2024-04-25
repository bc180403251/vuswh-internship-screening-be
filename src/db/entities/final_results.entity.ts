import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { StudentRegistration } from './student_registrations.entity';
@Entity({ name: 'final_results' })
export class FinalResults {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  internal_viva_marks: number;

  @Column()
  external_viva_marks: number;

  @Column()
  documentation_marks: number;

  @Column()
  total_marks: number;

  @IsNotEmpty()
  @IsString()
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: false,
  })
  @Column()
  supervisor_name: string;

  @IsNotEmpty()
  @IsString()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @Column()
  project_name: string;

  @Column()
  result: string;
  @Column()
  description: string;

  @ManyToOne(
    () => StudentRegistration,
    (studentRegistration) => studentRegistration.finalResults,
  )
  studentRegistration: StudentRegistration;
}
