import {CanteenReportExpenseItem} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import {ApiProperty} from "@nestjs/swagger";

export class CanteenReportItemEntity implements CanteenReportExpenseItem {

    @ApiProperty({description: "Canteen Report Item ID"})
    id: string;

    @ApiProperty({description: "Canteen Report Item Description", required: true, nullable: false})
    itemDescription: string;

    @ApiProperty({description: "Canteen Report Item Price", example: 1000, required: true, nullable: false})
    itemCost: Decimal;

    @ApiProperty({description: "School clinic expenses", required: false})
    schoolClinicExpenseId: string | null;

    @ApiProperty({description: "Faculty student development expenses", required: false})
    facultyStudentDevelopmentFundExpenseId: string | null;

    @ApiProperty({description: "HE instruction expenses", required: false})
    heInstructionExpenseId: string | null;

    @ApiProperty({description: "School operation expenses", required: false})
    schoolOperationExpenseId: string | null;

    @ApiProperty({description: "Revolving capital expenses", required: false})
    revolvingCapitalExpenseId: string | null;

    @ApiProperty({description: "Supplementary expenses", required: false})
    supplementaryExpenseId: string | null;
}