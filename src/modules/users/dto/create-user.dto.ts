//https://github.com/typestack/class-validator help
// npm i --save class-validator class-transformer
//@UsePipes() ValidationPipe
// app.useGlobalPipes(new ValidationPipe());

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsPhoneNumber() //+923334455662
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  @Matches(/^[A-Za-z0-9._%+-]+@vu\.edu\.pk$/, {
    message: 'Only vu.edu.pk domain is allowed',
  })
  email: string;

  @IsOptional()
  profile_pic: string;

  @ApiProperty()
  profilePicture: string;

  @ApiProperty()
  @IsArray()
  roleIds: string[];
  // username: string;
}
