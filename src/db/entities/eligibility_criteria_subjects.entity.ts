import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EligibilityCriteria } from './eligibility_criteria.entity';
import { Subject } from './subject.entity';
import { Grade } from 'src/common/constants';

@Entity({ name: 'eligibility_criteria_subjects' })
export class EligibilityCriteriaSubjects {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(
  //   () => EligibilityCriteria,
  //   (EligibilityCriteria) => EligibilityCriteria.eligibility_criteria_subjects,
  // )
  // eligibility_criterias: EligibilityCriteria;
  // eligibility_criteria_subjects: EligibilityCriteriaSubjects;
  // @ManyToOne(
  //   () => EligibilityCriteria,
  //   (EligibilityCriteria) => EligibilityCriteria.eligibility_criteria_subjects,
  // )
  // eligibility_criterias: EligibilityCriteria;
  // eligibility_criteria_subjects: EligibilityCriteriaSubjects;

  // @ManyToOne(
  //   () => EligibilityCriteria,
  //   (EligibilityCriteria) => EligibilityCriteria.eligibility_criteria_subjects,
  // )
  // eligibility_criteria: EligibilityCriteria;

  @ManyToOne(
    () => EligibilityCriteria,
    (EligibilityCriteria) => EligibilityCriteria.eligibility_criteria_subjects,
  )
  eligibility_criteria: EligibilityCriteria;
  @ManyToOne(
    () => Subject,
    (Subjects) => Subjects.eligibility_criteria_subjects,
  )
  subjects: Subject;

  @Column()
  grade: string;
}
