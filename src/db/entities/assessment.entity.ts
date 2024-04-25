import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StudentRegistration } from "./student_registrations.entity";
import { TestWeightage } from "./test_weightage.entity";
import { Batch } from "./batch.entity";
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'assessments' })
export class Assessment{
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
test_obtain_marks: number;

@Column()
test_obtain_weightage: number;

@Column()
test_comment: string;


@Column()
interview_obtain_marks: number;

@Column()
interview_obtain_weightage: number;

@Column()
interview_comment: string;

@Column()
total_obtain_marks: number;

@Column()
total_obtain_weightage: number;

@Column()
status: string;

@OneToOne(() => StudentRegistration, (StudentRegistration) => StudentRegistration.assessments)
@Exclude()
@JoinColumn()
StudentRegistration: StudentRegistration;

@ManyToOne(() => TestWeightage, (TestWeightage) => TestWeightage.Assessment)
@JoinColumn()
test_weightage: TestWeightage;

@ManyToOne(() => Batch, (batch) => batch.assessments)
batch: Batch; // Use lowercase 'batch'
}

