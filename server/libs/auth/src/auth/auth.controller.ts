import { Controller, Post, UseGuards, Body, Req, Get, Query, UnauthorizedException, Res, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiProperty, ApiBearerAuth } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail } from "class-validator"
import { AuthService } from '../auth.service';

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


@Controller('auth')
export class AuthController {
    constructor(private service:AuthService) {}
    @Post('/login')
    @UseGuards(AuthGuard("local"))
    login(@Body() dto: LoginDto, @Req() req):loginResult{
        return {status:true,token:this.service.login(req.user)}
    }
    @Get("user")
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    getUser(@Req() req){
        return req.user;
    }
}
