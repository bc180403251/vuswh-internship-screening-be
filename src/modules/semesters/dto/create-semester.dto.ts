import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateSemesterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  // @IsDateString()
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  start_date: Date;

  // @IsDateString()
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  end_date: Date;

  @IsBoolean()
  @ApiProperty()
  is_active: boolean;

  // @IsDate()
  // @ApiProperty()
  // archived_at: Date;
}
