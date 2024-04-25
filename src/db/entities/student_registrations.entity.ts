import {
  Column,
  CreateDateColumn,
  Double,
  Entity,
  JoinTable,
  ManyToMany,
  // JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  // OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Batch } from './batch.entity';
import { Phases } from './phases.entity';
import { User } from './user.entity';
import { cities } from './city.entity';
// import { Student_Subjects } from './Student_Subjects.entity';
import { IsNumber } from 'class-validator';
import { Subject } from './subject.entity';
import { student_subjects } from './Student_Subjects.entity';
import { PhaseHistory } from './phase_history.entity';
import { Assessment } from './assessment.entity';
import { FinalResults } from './final_results.entity';
// import { Attendance } from './attendance.entity';

// import { Student } from './student.entity';
@Unique(['student', 'batch'])
@Entity('student_registrations')
export class StudentRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // @Column()
  // city: string;

  @IsNumber()
  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: null,
    nullable: true,
  })
  cgpa: number;

  @Column()
  cv: string;

  @CreateDateColumn({ default: null })
  created_at: Date;

  @UpdateDateColumn({ default: null })
  updated_at: Date;

  @Column()
  processed_on: Date;

  @Column()
  comments: string;

  @Column({ default: false })
  is_open: boolean;

  @Column()
  is_enrolled_project: boolean;

  @Column({ default: 'Null' })
  attendance: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  attendanceDateTime: Date;

  // @Column({ default: 'Null' })
  // joining_attendance: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // joining_DateTime: Date;

  @ManyToOne(() => Student, (student) => student.studentregistrations)
  student: Student;

  @ManyToOne(() => Batch, (batch) => batch.studentregistrations)
  batch: Batch;

  @ManyToOne(() => Phases, (phase) => phase.studentregistrations)
  phase: Phases;

  @ManyToOne(() => User, (user) => user.studentregistrations)
  processed_by: User;

  @ManyToOne(() => cities, (city) => city.registrations)
  base_city: cities;

  @OneToMany(
    () => student_subjects,
    (registrationsubject) => registrationsubject.student_registration,
  )
  registrationsubjects: student_subjects[];
  // @ManyToMany(() => Subject, (subject) => subject.students, {
  //   onDelete: 'RESTRICT',
  // })
  // @JoinTable()
  // subjects: Subject[];

  @OneToMany(
    () => PhaseHistory,
    (PhaseHistory) => PhaseHistory.studentRegistration,
  )
  phaseHistory: PhaseHistory[];

  @OneToOne(() => Assessment, (Assessment) => Assessment.StudentRegistration)
  assessments: Assessment;

  @Column()
  testdate: Date;
  @Column()
  testaddress: string;

  @OneToMany(
    () => FinalResults,
    (finalResults) => finalResults.studentRegistration,
  )
  finalResults: FinalResults[];
}
