import { Controller, Get, Post, UseInterceptors, UploadedFile, UploadedFiles, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor, FileInterceptor } from "@nestjs/platform-express"
import {diskStorage} from "multer"
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { image } from '@libs/db/entity/Image.entity';

const Storage = diskStorage({
  destination(req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void){
      callback(null,process.env.UploadDir)
  },
  filename(req:Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void){
      callback(null,file.originalname);
    }
})

@Controller("/")
export class AppController {
  constructor(private readonly appService: AppService,@InjectConnection() private readonly dbConnection:Connection) {}
  @Get("options")
  options(){
    return {
      title:"计网管理中心",
      logo:"https://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/node/3225a568d6b74f82488573af4ede0e6d"
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @Post("upload-cos")
  @UseInterceptors(FileInterceptor("file"))
  Upload(@UploadedFile("file") file:any,@Req() req){
    this.appService.saveImage(req.user.id,file);
    return file;
  }

  @Post("uploads-cos")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor("file",5))//拦截多图片上传，最大数量-5
  Uploads(@UploadedFiles() files:[any],@Req() req:any){
    return files.forEach((value,index,arr)=>{
      return this.appService.saveImage(req.user.id,value);
    })
  }

  @Post("upload-local")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("file",{storage:Storage}))
  uploadLocal(@UploadedFile("file") file:{}){
    Object.assign(file,{url:`http://${process.env.ServerIp}/`+file["originalname"]})
    return file;
  }
}
