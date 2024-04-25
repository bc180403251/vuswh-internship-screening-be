import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Batch } from './batch.entity';
import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'semesters' })
export class Semester {
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

  @IsDateString()
  @Column({ name: 'start_date' })
  start_date: Date;

  @IsDateString()
  @Column({ name: 'end_date' })
  end_date: Date;

  @IsBoolean()
  @Column({ default: false })
  is_active: boolean;

  @DeleteDateColumn({ name: 'archived_at' })
  deleted_at: Date;

  @OneToOne(() => Batch, (batch) => batch.startInSemester)
  batchStartingSemester: Batch;

  @OneToOne(() => Batch, (batch) => batch.endInSemester)
  batchEndingSemester: Batch;
  // @OneToMany(() => Batch, (batch) => batch.startInSemester)
  // batchStartingSemester: Batch[];

  // @OneToMany(() => Batch, (batch) => batch.endInSemester)
  // batchEndingSemester: Batch[];
}
