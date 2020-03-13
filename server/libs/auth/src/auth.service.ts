import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt"
import { account } from '@libs/db/entity/account.entity';
import { registerDto } from './auth/auth.controller';
import { MajorService } from '@libs/major';
import { createTransport, SentMessageInfo } from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';


// transport.sendMail({
//     from:`计算机网络协会<2981926023@qq.com>`,
//     to:"2981926023@qq.com",
//     subject:"雅正吗",
//     html:"<sda>dsad<sda>"
// }).then(res=>{
//     console.log(res);
// }).catch((err:Error)=>{
//     console.log(err.message)
// })

@Injectable()
export class AuthService {
    transport: Mail;
    constructor(private jwtService: JwtService,@InjectConnection() private db:Connection) {}
    async register(body: registerDto):Promise<account>{
        const thisAccount = Object.assign(new account(),body);
        return await this.db.manager.save(thisAccount);
    }
    async sendEmailVCode(email: any): Promise<string> {
        const key = this.GenerateRandomKey();
        const res = await this.sendEmail(email, "验证码", `<h1>${key}</h1>`)
        return key;
    }
    nodeMailerInit(){
        this.transport = createTransport({
            host: 'smtp.qq.com',
            port: 465,
            auth: {
              user: process.env.email,
              pass: process.env.emailSecrtKey
            }
        })
    }
    sendEmail(to:string,title:string,msg:string):Promise<SentMessageInfo>{
        this.nodeMailerInit();
        return this.transport.sendMail({
            from:`计算机网络协会<${process.env.email}>`,
            to,
            subject:title,
            html:msg
        })
    }
    GenerateRandomKey(): string {
        return Math.floor(Math.random() * 10000001).toString(16)
    }

    login(user: account): string {
        const payload = { email: user.email, id: user.id, password: user.password };
        if (user.Grade >= 8) {
            return this.jwtService.sign(payload, { expiresIn: '2h' });
        } else {
            return this.jwtService.sign(payload)
        }
    }
}