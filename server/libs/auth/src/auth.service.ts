import { Injectable, UnauthorizedException } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt"
import { account } from '@libs/db/entity/Account.entity';

@Injectable()
export class AuthService {
    constructor(private jwtService:JwtService){}
    login(user:account):string{
        const payload = { email: user.email,id: user.id,password:user.password};
        return this.jwtService.sign(payload);
    }
}