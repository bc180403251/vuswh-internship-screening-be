import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IsNotEmpty, IsString } from 'class-validator';
@Entity({ name: 'email_templates' })
export class EmailTemplate {
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
  @Column()
  subject: string;

  @IsNotEmpty()
  @IsString()
  @Column({
    type: 'text',
    // length: 65535,
    nullable: false,
  })
  content: string;

  @CreateDateColumn({ default: null })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.emailtemplate)
  createdby: User;
}
