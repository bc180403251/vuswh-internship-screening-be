import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { EligibilityCriteria } from './eligibility_criteria.entity';
import { Subject } from './subject.entity';

@Entity({ name: 'degrees' })
export class degrees {
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
  title: string;

  @DeleteDateColumn({ name: 'archived_at',nullable:true })
  deleted_at: Date;

  @OneToMany(() => Student, (student) => student.degree)
  students: Student[];

  @OneToMany(
    () => EligibilityCriteria,
    (EligibilityCriteria) => EligibilityCriteria.degree,
  )
  eligibility_criteria: EligibilityCriteria[];

  // @JoinTable()
  // eligibility_criterias: EligibilityCriteria[];
  @ManyToMany(() => Subject, (subject) => subject.degrees, {
    onDelete: 'RESTRICT',
  })
  @JoinTable({ name: 'degrees_subjects' })
  subjects: Subject[];
}
