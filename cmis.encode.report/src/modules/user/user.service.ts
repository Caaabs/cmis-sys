import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../providers/database/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {
    }

    async getUsers() {
        return this.prismaService.user.findMany()
    }

    async getUserById(userId: string) {
        try{
            return this.prismaService.user.findUniqueOrThrow({where: {id: userId}});
        }catch {
            throw new NotFoundException(`User with id ${userId} not found.`);
        }
    }

}
