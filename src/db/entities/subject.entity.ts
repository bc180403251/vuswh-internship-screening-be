import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Student_Subjects } from './Student_Subjects.entity';
import { IsNotEmpty, IsString } from 'class-validator';
// import { EligibilityCriteriaSubject } from './eligibility_criteria_subject.entity';
import { EligibilityCriteriaSubjects } from './eligibility_criteria_subjects.entity';
import { degrees } from './degree.entity';
import { StudentRegistration } from './student_registrations.entity';
import { student_subjects } from './Student_Subjects.entity';

@Entity({ name: 'subjects' })
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
  })
  code: string;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column()
  is_active: boolean;

  @DeleteDateColumn({ name: 'archived_at' })
  deleted_at: Date;

  @OneToMany(() => student_subjects, (studentSubject) => studentSubject.subject)
  studentSubject: student_subjects[];

  // @OneToMany(()=> EligibilityCriteriaSubject,  (eligibility_criteria_subject)=>eligibility_criteria_subject.subjects)
  // eligibility_criteria_subject: EligibilityCriteriaSubject[];

  @OneToMany(
    () => EligibilityCriteriaSubjects,
    (eligibility_criteria_subjects) => eligibility_criteria_subjects.subjects,
  )
  eligibility_criteria_subjects: EligibilityCriteriaSubjects[];

  @ManyToMany(() => degrees, (degree) => degree.subjects, {
    onDelete: 'RESTRICT',
    //    onUpdate: 'RESTRICT',
  })
  degrees: degrees[];

  // @ManyToMany(() => StudentRegistration, (student) => student.subjects, {
  //   onDelete: 'RESTRICT',
  //   //    onUpdate: 'RESTRICT',
  // })
  // students: StudentRegistration[];

  @OneToMany(() => student_subjects, (studentsubject) => studentsubject.subject)
  registeredsubjects: student_subjects[];
}
