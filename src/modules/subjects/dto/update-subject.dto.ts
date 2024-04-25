import { PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create-subject.dto';
import { IsNotEmpty, IsDate } from 'class-validator';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}
