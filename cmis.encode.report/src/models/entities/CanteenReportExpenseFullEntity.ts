import {CanteenReportExpenseEntity} from "./CanteenReportExpenseEntity";
import {ApiProperty, OmitType} from "@nestjs/swagger";
import {CanteenReportExpenseCategoryFullEntity} from "./CanteenReportExpenseCategoryFullEntity";

export class CanteenReportExpenseFullEntity extends OmitType(CanteenReportExpenseEntity, ['canteenReportId']){
    @ApiProperty()
    supplementaryExpense: CanteenReportExpenseCategoryFullEntity;

    @ApiProperty()
    schoolClinicExpense: CanteenReportExpenseCategoryFullEntity;

    @ApiProperty()
    facultyStudentDevelopmentFundExpense: CanteenReportExpenseCategoryFullEntity;

    @ApiProperty()
    heInstructionExpense: CanteenReportExpenseCategoryFullEntity;

    @ApiProperty()
    schoolOperationExpense: CanteenReportExpenseCategoryFullEntity;

    @ApiProperty()
    revolvingCapitalExpense: CanteenReportExpenseCategoryFullEntity;

}