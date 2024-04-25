import { PartialType } from '@nestjs/swagger';
import { CreateStudentRegistrationDto } from './create_student_registration.dto';

export class UpdateStudentRegistrationDto extends PartialType(
  CreateStudentRegistrationDto,
) {}
