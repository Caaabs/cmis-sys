import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, Min, Max, IsNumber} from "class-validator";

export class CreateCanteenReportDto {

    @IsNotEmpty()
    @Min(1970)
    @Max(2200)
    @IsNumber()
    @ApiProperty({required: true, example: 2025, nullable: false, minimum: 1970, maximum: 2200})
    year: number;

    @IsNumber()
    @Min(1)
    @Max(12)
    @IsNotEmpty()
    @ApiProperty({required: true, example: 1, nullable: false, minimum: 1, maximum: 12})
    month: number;
}