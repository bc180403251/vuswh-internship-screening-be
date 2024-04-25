// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateBatchDto } from './create-batch.dto';
import { IsString } from 'class-validator';

export class UpdateBatchDto extends PartialType(CreateBatchDto) {
    // @IsString()
    // name: string;
    // semester_for_start_date_id: string;
    // semester_for_end_date_id: string;
    // start_date: Date;
    // end_date: Date;
}
