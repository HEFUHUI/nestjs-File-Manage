import { Controller, Get, Render, Req, UseGuards, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Connection } from 'typeorm';
import { account } from '@libs/db/entity/account.entity';
import { image } from '@libs/db/entity/image.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly db:Connection) {}

  @Get()
  @Render("home")
  async getHello(){
    const user = await this.db.manager.findOne(account,{where:{email:"2981926023@qq.com"}})
    return {user:user,state:"home"}
  }

  @Get("images")
  @UseGuards(AuthGuard("web"))
  async images(@Req() req:any,@Query() query:any):Promise<image[]>{
    if(query.page && query.limit){
      return await this.appService.getImagesWithPagination(req.user.id,query.page,query.limit);
    }else{
      return await this.appService.getImages(req.user.id);
    }
  }
}
