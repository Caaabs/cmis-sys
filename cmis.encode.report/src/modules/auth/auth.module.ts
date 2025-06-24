import { Module } from '@nestjs/common';
import {PassportModule} from "@nestjs/passport";
import {JwtAuthGuard} from "../../common/guards/jwt.auth.guard";
import {SupabaseStrategy} from "./strategies/supabase.strategy";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [PassportModule, ConfigModule, JwtModule.registerAsync({
        useFactory: (configService : ConfigService) => {
            return {
                global: true,
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' }
            }
        },
        inject: [ConfigService]
    })],
    providers: [JwtAuthGuard, SupabaseStrategy],
    exports: [JwtAuthGuard]
})
export class AuthModule {}
