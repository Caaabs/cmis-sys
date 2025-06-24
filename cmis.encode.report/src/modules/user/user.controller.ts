import {Controller, Get, UseGuards, Param} from '@nestjs/common';
import {UserService} from "./user.service";
import {Roles} from "../../common/decorators/roles.decorator";
import {JwtAuthGuard} from "../../common/guards/jwt.auth.guard";
import {RoleGuard} from "../../common/guards/role.guard";
import {ApiOkResponse} from "@nestjs/swagger";
import {UserEntity} from "../../models/entities/UserEntity";

@Controller({
    version: '1',
})
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/user')
    @Roles('admin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiOkResponse({type: UserEntity, isArray: true})
    async getUsers(){
        return this.userService.getUsers();
    }

    @Get('/user/:userId')
    @Roles('admin','employee')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiOkResponse({type: UserEntity})
    async getUserById(@Param('userId') userId: string) {
        return this.userService.getUserById(userId);
    }

}
