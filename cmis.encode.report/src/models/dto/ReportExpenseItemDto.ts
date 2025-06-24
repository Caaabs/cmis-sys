import {ApiProperty} from "@nestjs/swagger";
import {Decimal} from "@prisma/client/runtime/library";
import {IsNotEmpty, IsNumber, MaxLength, Min, MinLength} from "class-validator";

export class ReportExpenseItem {
    @ApiProperty({required: true, example: 1000.00, minimum: 0})
    @Min(0)
    @IsNotEmpty()
    @IsNumber()
    itemCost: Decimal;

    @ApiProperty({required: true, example: "Expense 1"})
    @MaxLength(50)
    itemDescription: string;
}