import {CanteenReportCurrentNetIncome, CanteenReportPreviousNetIncome} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import {ApiProperty} from "@nestjs/swagger";

export class CanteenReportNetIncomeEntity implements CanteenReportCurrentNetIncome, CanteenReportPreviousNetIncome {
    @ApiProperty({description: "Canteen Report Net Income ID"})
    id: string;

    @ApiProperty({description: "Supplementary Net Income", example: 1000})
    supplementaryNetIncome: Decimal;

    @ApiProperty({description: "School Clinic Net Income", example: 1000})
    schoolClinicNetIncome: Decimal;

    @ApiProperty({description: "Faculty Student Development Net Income", example: 1000})
    facultyStudentDevelopmentNetIncome: Decimal;

    @ApiProperty({description: "HE Instruction Net Income", example: 1000})
    heInstructionNetIncome: Decimal;

    @ApiProperty({description: "School Operation Net Income", example: 1000})
    schoolOperationNetIncome: Decimal;

    @ApiProperty({description: "Revolving Capital Net Income", example: 1000})
    revolvingCapitalNetIncome: Decimal;

    @ApiProperty({description: "Total Net Income", example: 1000})
    totalNetIncome: Decimal;

    @ApiProperty({description: "Canteen Report ID"})
    canteenReportId: string;
}