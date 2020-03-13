import { Controller, Post, UseGuards, Body, Req, Get, Query, UnauthorizedException, Res, HttpCode, NotAcceptableException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiProperty, ApiBearerAuth } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail } from "class-validator"
import { AuthService } from '../auth.service';
import { MajorModule } from '@libs/major';
import { account } from '@libs/db/entity/account.entity';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty({message:"邮箱不能为空"})
    @ApiProperty()
    email: string

    @IsNotEmpty({message:"密码不能为空"})
    @ApiProperty()
    password: string

}

class loginResult{
    status:Boolean
    token?:string
}

export class registerDto{
    @IsNotEmpty()
    email:string
    @IsNotEmpty()
    password:string
    @IsNotEmpty()
    vCode:string
}

@Controller('auth')
export class AuthController {
    constructor(private service:AuthService) {}

    private vCodes:{[key:string]:string}
    
    @Post('/login')
    @UseGuards(AuthGuard("local"))
    login(@Body() dto: LoginDto, @Req() req:any):loginResult{
        return {status:true,token:this.service.login(req.user)}
    }

    @Get("user")
    @UseGuards(AuthGuard('web'))
    @ApiBearerAuth()
    getUser(@Req() req:any){
        return {
            user:req.user
        };
    }

    @Get('vcode')
    async sendEmailVCode(@Query() query:any){
        if(query.email){
            const code = await this.service.sendEmailVCode(query.email);
            if(this.vCodes === undefined){
                this.vCodes = {};
            }
            this.vCodes[query.email] = code;
        }else{
            throw new NotAcceptableException("email is not found")
        }
    }

    @Post("register")
    async register(@Body() body:registerDto):Promise<account>{
        if(this.vCodes[body.email] && body.vCode.toUpperCase() === this.vCodes[body.email].toUpperCase()){
            return await this.service.register(body);
        }else{
            throw new NotAcceptableException("Bad verification code")
        }
    }
}
