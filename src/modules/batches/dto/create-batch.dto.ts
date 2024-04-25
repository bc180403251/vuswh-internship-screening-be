import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Unique } from 'typeorm';

export class CreateBatchDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester_for_start_date_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester_for_end_date_id: string;

  @IsNotEmpty()
  @ApiProperty()
  is_current: boolean;

  // @IsNotEmpty()
  @ApiProperty()
  registration_status: boolean;

  @Type(() => Date)
  @IsDate()
  // @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  registration_startdate: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  // @IsNotEmpty()
  @ApiProperty()
  registration_enddate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  end_date: Date;
}
