import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';
import { Column } from 'typeorm';

export class CreateEligibilityCriteriaDto {
  @ApiProperty()
  batch_id: string;

  // @ApiProperty()
  // id: string;

  @ApiProperty()
  degreeId: string;

  @ApiProperty()
  // @Min(0, { message: 'Minimum CGPA must be a positive number.' })
  minimum_cgpa: number;

  // @IsNotEmpty()
  @ApiProperty()
  project_enrollment: boolean;

  // @IsNotEmpty()
  @ApiProperty()
  include_grades: boolean;

  // @IsNotEmpty()
  @ApiProperty()
  subjectsId: string[];

  // @IsNotEmpty()
  @ApiProperty()
  grade: string[];

  @ApiProperty()
  EligibilityCriteriaSubjects: any[];
}
