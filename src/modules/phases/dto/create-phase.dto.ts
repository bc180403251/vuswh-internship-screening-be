import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class CreatePhaseDto {
    // @Column()
    @ApiProperty()
    name: string;

    @ApiProperty()
    sequence: number;
}
