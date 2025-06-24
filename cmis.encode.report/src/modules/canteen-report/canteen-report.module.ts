import { Module } from '@nestjs/common';
import { CanteenReportController } from './canteen-report.controller';
import { CanteenReportService } from './canteen-report.service';
import {PrismaService} from "../../providers/database/prisma/prisma.service";
import {UserService} from "../user/user.service";

@Module({
  controllers: [CanteenReportController],
  providers: [CanteenReportService, PrismaService, UserService],
})
export class CanteenReportModule {}
