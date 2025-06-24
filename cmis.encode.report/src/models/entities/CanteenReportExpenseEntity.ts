import {CanteenReportExpense} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class CanteenReportExpenseEntity implements CanteenReportExpense {
    @ApiProperty({description: "Canteen Report Expense ID"})
    id: string;
    @ApiProperty({description: "Canteen Report ID"})
    canteenReportId: string;
}