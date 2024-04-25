import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { StudentRegistration } from './student_registrations.entity';
import { Phases } from './phases.entity';
import { User } from './user.entity';

@Entity('phase_histories')
export class PhaseHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  processed_on: Date;

  @Column()
  comments: string;

  @ManyToOne(
    () => StudentRegistration,
    (StudentRegistration) => StudentRegistration.phaseHistory,
  )
  studentRegistration: StudentRegistration;

  @ManyToOne(() => Phases, (Phases) => Phases.phaseHistory)
  phases: Phases;

  @ManyToOne(() => User, (User) => User.phaseHistory)
  processed_by: User;
}
