import {ApiProperty} from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/library";

export class CreateCanteenReportItemDto {
    @ApiProperty({required: true})
    itemCategory: string;

    @ApiProperty({required: true, example: 1000.00, minimum: 0})
    itemCost: Decimal;

    @ApiProperty({required: true})
    itemDescription: string;

}