import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StudentRegistration } from './student_registrations.entity';
import { Subject } from './subject.entity';
import { Grade } from 'src/common/constants';

@Entity('student_subjects')
export class student_subjects {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  grade: string;

  @ManyToOne(
    () => StudentRegistration,
    (registration) => registration.registrationsubjects,
  )
  student_registration: StudentRegistration;

  @ManyToOne(() => Subject, (course) => course.registeredsubjects)
  subject: Subject;
}
