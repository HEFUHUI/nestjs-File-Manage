import { Controller, Get, Render, Res, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { Connection } from 'typeorm';
import { account } from '@libs/db/entity/Account.entity';
import * as captcha from "svg-captcha"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly db:Connection) {}

  @Get()
  @Render("home")
  async getHello(@Req() res){
    console.log(res.session);
    const user = await this.db.manager.findOne(account,{where:{email:"2981926023@qq.com"}})
    return {user:user,state:"home"}
  }

  @Get("login")
  @Render("login")
  login(@Req() req){
    const vCode = captcha.create({
      size:4
    })
    req.session.vCode = vCode.text;
    return {vCode:vCode.data,user:'',state:'login'};
  }
}
