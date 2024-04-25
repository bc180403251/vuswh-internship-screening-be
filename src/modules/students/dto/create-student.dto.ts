import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  matches,
} from 'class-validator';

export class CreateStudentDto {
  // @IsString()
  // @IsNotEmpty()
  // @MinLength(11)

  vuid: string;

  @ApiProperty()
  degreeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(13)
  @MaxLength(15)
  cnic: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(13)
  @IsPhoneNumber()
  phone: string;

  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[A-Za-z0-9._%+-]+@vu\.edu\.pk$/, {
    message: 'Only vu.edu.pk domain is allowed',
  })
  @ApiProperty()
  email: string;

  password: string;
  roleId: string;
}
