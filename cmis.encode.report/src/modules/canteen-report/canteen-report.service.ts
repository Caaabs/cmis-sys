import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../providers/database/prisma/prisma.service";
import {CreateCanteenReportItemDto} from "../../models/dto/CreateCanteenReportItemDto";
import {CreateCanteenReportDto} from "../../models/dto/CreateCanteenReportDto";
import {UserService} from "../user/user.service";
import {SubmitReportDto} from "../../models/dto/SubmitReportDto";
import {Status} from "@prisma/client";

@Injectable()
export class CanteenReportService {
    constructor(private readonly prismaService: PrismaService, private readonly userService: UserService) {
    }

    async getUserReportsByUserId(userId: string){
        return this.prismaService.canteenReport.findMany({where: {userId: userId}});
    }

    async postReport(userId: string, report: CreateCanteenReportDto) {

        await this.userService.getUserById(userId);

        const existingReport = await this.prismaService.canteenReport.findFirst(
            { where: {
            AND: [
                {userId: userId},
                {month: report.month},
                {year: report.year}
            ]
            }})

        if(existingReport) {
            throw new ConflictException(`Report for ${report.month}-${report.year} already exists.`);
        }

        const payload = {
            ...report, userId
        }

        return this.prismaService.canteenReport.create(
            {data: payload}
        )
    }

    async getUserReportByUserIdAndReportId(userId: string, reportId: string) {
        try{
            return await this.prismaService.canteenReport.findFirstOrThrow(
                {
                    relationLoadStrategy: 'join',
                    where: {
                        AND: [
                            {id: reportId},
                            {userId: userId}
                        ]
                    },
                    select: {
                        id: true,
                        status: true,
                        userId: true,
                        month: true,
                        year: true,
                        canteenReportPreviousNetIncome: true,
                        canteenReportCurrentNetIncome: true,
                        canteenReportExpense:{
                            select: {
                                id: true,
                                supplementaryExpense: {
                                    select: {
                                        id: true,
                                        expenses: {
                                            select: {
                                                id: true,
                                                itemDescription: true,
                                                itemCost: true
                                            }
                                        },
                                        totalCost: true
                                    }
                                },
                                schoolClinicExpense: {
                                    select: {
                                        id: true,
                                        expenses: {
                                            select: {
                                                id: true,
                                                itemDescription: true,
                                                itemCost: true
                                            }
                                        },
                                        totalCost: true
                                    }
                                },
                                facultyStudentDevelopmentFundExpense: {
                                    select: {
                                        id: true,
                                        expenses: {
                                            select: {
                                                id: true,
                                                itemDescription: true,
                                                itemCost: true
                                            }
                                        },
                                        totalCost: true
                                    }
                                },
                                heInstructionExpense: {
                                    select: {
                                        id: true,
                                        expenses: {
                                            select: {
                                                id: true,
                                                itemDescription: true,
                                                itemCost: true
                                            }
                                        },
                                        totalCost: true
                                    }
                                },
                                schoolOperationExpense: {
                                    select: {
                                        id: true,
                                        expenses: {
                                            select: {
                                                id: true,
                                                itemDescription: true,
                                                itemCost: true
                                            }
                                        },
                                        totalCost: true
                                    }
                                },
                                revolvingCapitalExpense: {
                                    select: {
                                        id: true,
                                        expenses: {
                                            select: {
                                                id: true,
                                                itemDescription: true,
                                                itemCost: true
                                            }
                                        },
                                        totalCost: true
                                    }
                                }
                            }
                        }
                    }
                }
            );
        }catch (e){
            throw new NotFoundException(`Report not found`);
        }
    }

    async postSubmitReport(userId: string, reportId: string, payload: SubmitReportDto) {
        try{
            let {
                canteenReportPreviousNetIncome,
                canteenReportCurrentNetIncome,
                supplementaryExpense,
                schoolClinicExpense,
                facultyStudentDevelopmentFundExpense,
                heInstructionExpense,
                schoolOperationExpense,
                revolvingCapitalExpense} = payload;


            const report = await this.getUserReportByUserIdAndReportId(userId, reportId);

            if(report.status === Status.SUBMITTED){
                throw new ConflictException("Report already submitted")
            }

            const submittedReport = await this.prismaService.canteenReport.update({
                data: {
                    status: "SUBMITTED",
                    canteenReportPreviousNetIncome: {
                        create: canteenReportPreviousNetIncome
                    },
                    canteenReportCurrentNetIncome: {
                        create: canteenReportCurrentNetIncome
                    },
                    canteenReportExpense: {
                        create: {
                            supplementaryExpense: {
                                create: {
                                    expenses: {
                                        create: supplementaryExpense.expenses
                                    },
                                    totalCost: supplementaryExpense.totalCost
                                }
                            },
                            schoolClinicExpense: {
                                create: {
                                    expenses: {
                                        create: schoolClinicExpense.expenses
                                    },
                                    totalCost: schoolClinicExpense.totalCost
                                }
                            },
                            facultyStudentDevelopmentFundExpense:{
                                create: {
                                    expenses: {
                                        create: facultyStudentDevelopmentFundExpense.expenses
                                    },
                                    totalCost: facultyStudentDevelopmentFundExpense.totalCost
                                }
                            },
                            heInstructionExpense: {
                                create: {
                                    expenses: {
                                        create: heInstructionExpense.expenses
                                    },
                                    totalCost: heInstructionExpense.totalCost
                                }
                            },
                            schoolOperationExpense: {
                                create: {
                                    expenses: {
                                        create: schoolOperationExpense.expenses
                                    },
                                    totalCost: schoolOperationExpense.totalCost
                                }
                            },
                            revolvingCapitalExpense: {
                                create: {
                                    expenses: {
                                        create: revolvingCapitalExpense.expenses
                                    },
                                    totalCost: revolvingCapitalExpense.totalCost
                                }
                            }
                        }
                    }
                }, where: {
                    id: reportId,
                }
            })

            return {id: submittedReport.id, submitted: true};

        }catch (e){
            throw e;
        }


    }
}
