import {ReportExpenseDto} from "./ReportExpenseDto";
import {IsObject, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {ReportNetIncomeDto} from "./ReportNetIncomeDto";

export class SubmitReportDto {

    @ApiProperty({required: true})
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => ReportNetIncomeDto)
    canteenReportPreviousNetIncome: ReportNetIncomeDto;

    @ApiProperty({required: true})
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => ReportNetIncomeDto)
    canteenReportCurrentNetIncome: ReportNetIncomeDto;

    @ApiProperty({required: true})
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => ReportExpenseDto)
    supplementaryExpense: ReportExpenseDto;

    @ApiProperty({required: true})
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => ReportExpenseDto)
    schoolClinicExpense: ReportExpenseDto;

    @ApiProperty({required: true})
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => ReportExpenseDto)
    facultyStudentDevelopmentFundExpense: ReportExpenseDto;

    @ApiProperty({required: true})
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => ReportExpenseDto)
    heInstructionExpense: ReportExpenseDto;

    @ApiProperty({required: true})
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => ReportExpenseDto)
    schoolOperationExpense: ReportExpenseDto;

    @ApiProperty({required: true})
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => ReportExpenseDto)
    revolvingCapitalExpense: ReportExpenseDto;
}