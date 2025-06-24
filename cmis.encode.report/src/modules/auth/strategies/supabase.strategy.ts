import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import {ConfigService} from "@nestjs/config";
import e from "express";

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy){
    constructor(private readonly configService: ConfigService) {

        // @ts-ignore
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        }
        )
    }

    async validate(payload: any): Promise<any>  {
        const user = payload.user_metadata;
        return {
            userId: user.sub,
            userRole: user.user_role
        }
    }

    authenticate(req: e.Request, options?: any) {
        super.authenticate(req, options);
    }
}