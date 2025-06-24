import {CanteenReportEntity} from "./CanteenReportEntity";
import {CanteenReportNetIncomeEntity} from "./CanteenReportNetIncomeEntity";
import {ApiProperty} from "@nestjs/swagger";
import {CanteenReportExpenseFullEntity} from "./CanteenReportExpenseFullEntity";

export class CanteenReportFullEntity extends  CanteenReportEntity{
    @ApiProperty({description: "Canteen Report Previous Net Income"})
    canteenReportPreviousNetIncome: CanteenReportNetIncomeEntity;

    @ApiProperty({description: "Canteen Report Current Net Income"})
    canteenReportCurrentNetIncome: CanteenReportNetIncomeEntity;

    @ApiProperty()
    canteenReportExpense: CanteenReportExpenseFullEntity
}