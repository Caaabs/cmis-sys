import { ApiProperty } from "@nestjs/swagger";
import {Decimal} from "@prisma/client/runtime/library";
import {IsNotEmpty, IsNumber, Min} from "class-validator";

export class ReportNetIncomeDto {
    @ApiProperty({required: true, example: 1000.00, minimum: 0})
    @Min(0)
    @IsNotEmpty()
    @IsNumber()
    supplementaryNetIncome: Decimal;

    @ApiProperty({required: true, example: 1000.00, minimum: 0})
    @Min(0)
    @IsNotEmpty()
    @IsNumber()
    schoolClinicNetIncome: Decimal;

    @ApiProperty({required: true, example: 1000.00, minimum: 0})
    @Min(0)
    @IsNotEmpty()
    @IsNumber()
    facultyStudentDevelopmentNetIncome: Decimal;

    @ApiProperty({required: true, example: 1000.00, minimum: 0})
    @Min(0)
    @IsNotEmpty()
    @IsNumber()
    heInstructionNetIncome: Decimal;

    @ApiProperty({required: true, example: 1000.00, minimum: 0})
    @Min(0)
    @IsNotEmpty()
    @IsNumber()
    schoolOperationNetIncome: Decimal;

    @ApiProperty({required: true, example: 1000.00, minimum: 0})
    @Min(0)
    @IsNotEmpty()
    @IsNumber()
    revolvingCapitalNetIncome: Decimal;

    @ApiProperty({required: true, example: 1000.00, minimum: 0})
    @Min(0)
    @IsNotEmpty()
    @IsNumber()
    totalNetIncome: Decimal;
}