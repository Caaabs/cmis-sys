import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CanteenReportService } from './canteen-report.service';

import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CanteenReportEntity } from '../../models/entities/CanteenReportEntity';
import { CreateCanteenReportDto } from '../../models/dto/CreateCanteenReportDto';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SubmitReportDto } from '../../models/dto/SubmitReportDto';
import { CanteenReportFullEntity } from '../../models/entities/CanteenReportFullEntity';

@Controller({
  version: '1',
})
export class CanteenReportController {
  constructor(private readonly canteenReportService: CanteenReportService) {}

  @Get('/user/:userId/report')
  @Roles('admin', 'employee')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: CanteenReportEntity, isArray: true })
  @ApiInternalServerErrorResponse()
  async getUserReportsByUserId(
    @Param('userId') userId: string,
  ): Promise<CanteenReportEntity[]> {
    return this.canteenReportService.getUserReportsByUserId(userId);
  }

  @Get('user/:userId/report/:reportId')
  @Roles('admin', 'employee')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: CanteenReportFullEntity })
  @ApiNotFoundResponse({
    schema: {
      properties: {
        message: {
          type: 'string',
        },
        error: {
          type: 'string',
        },
        statusCode: {
          type: 'number',
          example: 404,
        },
      },
    },
  })
  @ApiInternalServerErrorResponse()
  async getUserReportById(
    @Param('userId') userId: string,
    @Param('reportId') reportId: string,
  ) {
    return this.canteenReportService.getUserReportByUserIdAndReportId(
      userId,
      reportId,
    );
  }

  @Post('/user/:userId/report')
  @Roles('employee')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiCreatedResponse({ type: CanteenReportEntity })
  @ApiInternalServerErrorResponse()
  async postReport(
    @Param('userId') userId: string,
    @Body() report: CreateCanteenReportDto,
  ) {
    return this.canteenReportService.postReport(userId, report);
  }

  @Post('/user/:userId/report/:reportId/submit')
  @Roles('employee')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({
    schema: {
      properties: {
        id: {
          type: 'string',
        },
        submitted: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiConflictResponse({
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Report Already submitted',
        },
        error: {
          type: 'string',
          example: 'Conflict',
        },
        statusCode: {
          type: 'number',
          example: 409,
        },
      },
    },
  })
  @ApiInternalServerErrorResponse()
  @HttpCode(200)
  async postSubmitReport(
    @Param('userId') userId: string,
    @Param('reportId') reportId: string,
    @Body() payload: SubmitReportDto,
  ) {
    return this.canteenReportService.postSubmitReport(
      userId,
      reportId,
      payload,
    );
  }
}
