import {ApiProperty} from "@nestjs/swagger";
import {Decimal} from "@prisma/client/runtime/library";
import {ReportExpenseItem} from "./ReportExpenseItemDto";
import {IsArray, IsNotEmpty, IsNumber, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class ReportExpenseDto {

    @ApiProperty({required: true, example: [{itemDescription: "Expense Example", itemCost: 1000}]})
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({each: true})
    @Type(() => ReportExpenseItem)
    expenses: ReportExpenseItem[]

    @ApiProperty({required: true, example: 1000.00, minimum: 0})
    @IsNotEmpty()
    @IsNumber()
    totalCost: Decimal;

}