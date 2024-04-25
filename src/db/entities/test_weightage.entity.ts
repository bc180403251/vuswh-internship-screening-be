import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';
import { Batch } from './batch.entity';

@Entity({ name: 'test_weightages' })
export class TestWeightage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  test_weightage: number;

  @Column()
  interview_weightage: number;

  @Column()
  total_weightage: number;
  @Column()
  test_total_marks: number;

  @Column()
  interview_total_marks: number;

  @Column()
  total_marks: number;

  @OneToMany(() => Assessment, (Assessment) => Assessment.test_weightage)
  Assessment: Assessment[];

  @OneToOne(() => Batch, (batch) => batch.test_weightage)
  @JoinColumn()
  batch: Batch;
}
