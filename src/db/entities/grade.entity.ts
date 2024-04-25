import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'grades' })
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  grade: string;
}
