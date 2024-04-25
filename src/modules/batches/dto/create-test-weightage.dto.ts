import { ApiProperty } from '@nestjs/swagger';

export class createTestWieghtagedto {
  @ApiProperty()
  test_total_marks: number;

  @ApiProperty()
  interview_total_marks: number;

  @ApiProperty()
  total_marks: number;

  @ApiProperty()
  test_weightage: number;

  @ApiProperty()
  interview_weightage: number;

  @ApiProperty()
  total_weightage: number;
}
