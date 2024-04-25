import { PartialType } from '@nestjs/swagger';
import { CreateSemesterDto } from './create-semester.dto';
import { IsDate, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateSemesterDto extends PartialType(CreateSemesterDto) {

}
