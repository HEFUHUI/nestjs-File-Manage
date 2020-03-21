import { Controller, Get, Render, Req, UseGuards, Query, Post, UseInterceptors, UploadedFile, Put, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Connection } from 'typeorm';
import { account } from '@libs/db/entity/account.entity';
import { image } from '@libs/db/entity/image.entity';
import { AuthGuard } from '@nestjs/passport';
import { EventsGateway } from './events.gateway';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly db: Connection, private readonly Gateway: EventsGateway) { }

  @Get()
  @Render("home")
  async getHello() {
    const user = await this.db.manager.findOne(account, { where: { email: "2981926023@qq.com" } })
    return { user: user, state: "home" }
  }

  @Get("images")
  @UseGuards(AuthGuard("web"))
  async images(@Req() req: any, @Query() query: any): Promise<image[]> {
    if (query.page && query.limit) {
      return await this.appService.getImagesWithPagination(req.user.id, query.page, query.limit);
    } else {
      return await this.appService.getImages(req.user.id);
    }
  }

  @Get("get_user_info/:id")
  getUserInfo(@Param() p:{id:string}){
    return this.appService.getUserInfo(p.id);
  }

  @UseGuards(AuthGuard("web"))
  @ApiBearerAuth()
  @Post("upload-cos")
  @UseInterceptors(FileInterceptor("file"))
  Upload(@UploadedFile("file") file:any,@Req() req:any){
    const img = this.db.getRepository(image);
    return this.db.manager.save(img.create({url:file.url,type:file.mimetype,alias:file.originalname,author:req.user.id,purpose:"user"}));
  }

  @Put("changeUser")
  @UseGuards(AuthGuard("web"))
  async CommitChange(@Req() req:any,@Body() body:{nickName:string,motto:string,like:string}){
    const Account:account = await this.db.manager.findOne(account,req.user.id);
    Object.assign(Account,{nickName:body.nickName,motto:body.motto,like:body.like});
    return await this.db.manager.save(Account);
  }

  @Put("changeUser_avatar")
  @UseGuards(AuthGuard("web"))
  async changeavatar(@Req() req:any,@Body() body:image){
    const Account:account = await this.db.manager.findOne(account,req.user.id);
    Object.assign(Account,{avatar:body});
    return await this.db.manager.save(Account);
  }

  @Get("search")
  async search(@Query() query:{wd:string}):Promise<any>{
    return await this.appService.search(query.wd);
  }
}
