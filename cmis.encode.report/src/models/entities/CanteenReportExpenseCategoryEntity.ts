import {
    FacultyStudentDevelopmentFundExpense, HeInstructionExpense, RevolvingCapitalExpense,
    SchoolClinicExpense,
    SchoolOperationExpense,
    SupplementaryExpense
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import {ApiProperty} from "@nestjs/swagger";

export class CanteenReportExpenseCategoryEntity implements SupplementaryExpense, SchoolClinicExpense, FacultyStudentDevelopmentFundExpense, SchoolOperationExpense, HeInstructionExpense, RevolvingCapitalExpense {
    @ApiProperty()
    id: string;

    @ApiProperty({example: 1000})
    totalCost: Decimal;

    @ApiProperty()
    canteenReportExpenseId: string;

}