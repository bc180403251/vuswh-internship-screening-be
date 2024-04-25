import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateEmailTemplateDto {
  @IsNotEmpty()
  @ApiProperty()
  subject: string;

  @IsNotEmpty()
  @ApiProperty()
  content: string;

  created_at: Date;

  // @IsNotEmpty()
  @ApiProperty()
  createdById: string;
}
