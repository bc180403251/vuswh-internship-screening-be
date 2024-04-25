import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StudentRegistration } from './student_registrations.entity';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PhaseHistory } from './phase_history.entity';

@Entity({ name: 'phases' })
export class Phases {
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

  @IsNumber()
  @Column()
  sequence: number;

  @OneToMany(
    () => StudentRegistration,
    (studentregistration) => studentregistration.phase,
  )
  studentregistrations: StudentRegistration[];

  @OneToMany(
    ()=> PhaseHistory,
    (PhaseHistory)=> PhaseHistory.phases
  )
  phaseHistory: PhaseHistory[];
}
