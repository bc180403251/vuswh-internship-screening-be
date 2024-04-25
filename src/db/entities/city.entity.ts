import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StudentRegistration } from './student_registrations.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'cities' })
export class cities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  name: string;

  @OneToMany(
    () => StudentRegistration,
    (registrations) => registrations.base_city,
  )
  registrations: StudentRegistration[];
}
