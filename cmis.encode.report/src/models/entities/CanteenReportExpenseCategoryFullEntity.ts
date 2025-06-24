import {ApiProperty, OmitType} from "@nestjs/swagger";
import {CanteenReportExpenseCategoryEntity} from "./CanteenReportExpenseCategoryEntity";
import {CanteenReportItemEntity} from "./CanteenReportItemEntity";

export class CanteenReportExpenseCategoryFullEntity extends OmitType(CanteenReportExpenseCategoryEntity, ["canteenReportExpenseId"]){
    @ApiProperty({type: OmitType(CanteenReportItemEntity,["heInstructionExpenseId","supplementaryExpenseId","facultyStudentDevelopmentFundExpenseId", "schoolOperationExpenseId", "schoolClinicExpenseId", "revolvingCapitalExpenseId"]), isArray: true})
    expenses: CanteenReportItemEntity[]
}