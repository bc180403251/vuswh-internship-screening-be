import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Semester } from './semester.entity';
import { StudentRegistration } from './student_registrations.entity';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { EligibilityCriteria } from './eligibility_criteria.entity';
import { degrees } from './degree.entity';
import { TestWeightage } from './test_weightage.entity';
import { Assessment } from './assessment.entity';

@Entity({ name: 'batches' })
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  name: string;

  // @IsDateString()
  @Column({ type: Date, unique: true })
  start_date: Date;

  // @IsDateString()
  @Column({ type: Date, unique: true })
  end_date: Date;

  @Column({ type: Date })
  registration_startdate: Date;

  @Column({ type: Date })
  registration_enddate: Date;

  @Column({ default: false })
  registration_status: boolean;

  @Column({ default: false })
  is_current: boolean;

  @Column({ default: false })
  is_screened: boolean;

  @DeleteDateColumn({ name: 'archived_at' })
  deleted_at: Date;

  @OneToOne(() => Semester, (semester) => semester.batchStartingSemester)
  @JoinColumn()
  startInSemester: Semester;

  @OneToOne(() => Semester, (semester) => semester.batchEndingSemester)
  @JoinColumn()
  endInSemester: Semester;

  @OneToMany(
    () => StudentRegistration,
    (studentregistration) => studentregistration.batch,
  )
  studentregistrations: StudentRegistration[];

  @OneToMany(
    () => EligibilityCriteria,
    (eligibility_criteria) => eligibility_criteria.batch,
  )
  // @JoinColumn()
  eligibility_criteria: EligibilityCriteria[];

  @OneToOne(() => TestWeightage, (test_weightage) => test_weightage.batch)
  test_weightage: TestWeightage;

  @OneToMany(() => Assessment, (assessment) => assessment.batch)
  assessments: Assessment[]; // Use lowercase 'assessments'
}
