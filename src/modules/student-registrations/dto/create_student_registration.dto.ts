import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { Double } from 'typeorm';

export class CreateStudentRegistrationDto {
  @ApiProperty()
  userId: string; //get from session and pass on to BE

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  update_at: Date;

  @ApiProperty()
  processed_on: Date;

  @ApiProperty()
  comments: string;

  @ApiProperty()
  is_open: string;

  @ApiProperty()
  StudentData: string;

  @ApiProperty()
  currentBatch: string;

  @ApiProperty()
  batchId: string;

  @ApiProperty()
  // @IsNotEmpty()
  cityId: string;

  @ApiProperty()
  // @IsNotEmpty()/
  cgpa: number;

  @ApiProperty()
  // @IsNotEmpty()
  isEnrolledInProject: boolean;

  @ApiProperty()
  // @IsNotEmpty()
  cv: string;

  @ApiProperty()
  // @IsNotEmpty()
  registeredSubjects: any[];

  @ApiProperty()
  phaseId: any;
  // attendance -----------

  @ApiProperty()
  attendance: string;

  @ApiProperty()
  attendanceDateTime: Date;

  @ApiProperty()
  joining_attendance: string;

  @ApiProperty()
  joining_DateTime: Date;

  @ApiProperty()
  SRIds: string[];
  //email setup---------------

  @ApiProperty()
  subject: string;

  @ApiProperty()
  mailbody: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  testdate: Date;

  @ApiProperty()
  testaddress: string;

  //setResults-------------------
  @ApiProperty()
  testObtainMarks: number;

  @ApiProperty()
  testcomment: string;

  @ApiProperty()
  interviewObtainMarks: number;

  @ApiProperty()
  interviewcomment: string;

  @ApiProperty()
  testObtainWeightage: number;

  @ApiProperty()
  interviewObtainweightage: number;

  @ApiProperty()
  totalObtainmarks: number;

  @ApiProperty()
  totalObtainweightage: number;

  @ApiProperty()
  registrationId: string;

  test_weightageId:string
}
