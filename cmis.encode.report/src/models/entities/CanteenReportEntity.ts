import {CanteenReport, Status} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class CanteenReportEntity implements CanteenReport{

    @ApiProperty({description:"Canteen Report ID"})
    id: string;

    @ApiProperty({description:"Date of Creation of the Canteen Report"})
    createdAt: Date;

    @ApiProperty({required: true, description:"Canteen Report year" , nullable: false})
    year: number;

    @ApiProperty({required: true, description:"Canteen Report date", nullable: false})
    month: number;

    @ApiProperty({required: true, description:"User Id", nullable: false})
    userId: string;

    @ApiProperty({description:"Canteen Report status", default:"DRAFT", nullable: false})
    status: Status
}