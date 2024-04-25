import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { degrees } from './degree.entity';
import { Batch } from './batch.entity';
// import { EligibilityCriteriaSubject } from "./eligibility_criteria_subject.entity";
import { EligibilityCriteriaSubjects } from './eligibility_criteria_subjects.entity';
import { IsNotEmpty } from 'class-validator';

@Entity({ name: 'eligibility_criterias' })
@Unique(['batch', 'degree'])
export class EligibilityCriteria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({
  //     length: 4,
  //     nullable: false,

  // })
  @Column({ type: 'decimal', precision: 4, scale: 1, default: 0 })
  @IsNotEmpty()
  minimum_cgpa: number;

  // @IsNotEmpty()
  @Column()
  project_enrollment: boolean;
  // @IsNotEmpty()

  @Column()
  include_grades: boolean;

  @ManyToOne(() => degrees, (degree) => degree.eligibility_criteria)
  @JoinTable()
  degree: degrees;

  @ManyToOne(() => Batch, (batch) => batch.eligibility_criteria)
  batch: Batch;

  @OneToMany(
    () => EligibilityCriteriaSubjects,
    (eligibility_criteria_subjects) =>
      eligibility_criteria_subjects.eligibility_criteria,
    { cascade: true }, // Add this line
  )
  eligibility_criteria_subjects: EligibilityCriteriaSubjects[];

  // parent: Degree[];
}
