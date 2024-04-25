import { ApiProperty } from "@nestjs/swagger";
import { Timestamp } from "typeorm";

export class CreatePhaseHistoryDto {
    @ApiProperty()
    studentRegistrationId: string;

    @ApiProperty()
    phasesId: string;

    @ApiProperty()
    processedById: string;

    // @ApiProperty()
    // id: string;

    // @ApiProperty()
    processed_on: Timestamp;

    @ApiProperty()
    comments: string;
}
