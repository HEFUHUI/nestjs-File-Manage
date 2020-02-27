import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MajorModule } from '@libs/major';
import { MulterModule } from "@nestjs/platform-express"
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { ImagesModule } from './images/images.module';
import { AccountModule } from './account/account.module';
import { LabelModule } from './label/label.module';
import { FilesModule } from './files/files.module';
import MulterCos = require("multer-cos"); 

@Module({
  imports: [MajorModule,MulterModule.registerAsync({
    useFactory(){
      return {
        storage:MulterCos({
          cos:{
            SecretId:process.env.SecretId,
            SecretKey:process.env.SecretKey,
            Bucket:process.env.Bucket,
            Region:process.env.Region,
            dir:process.env.dir
          },
        })
      }
    }
  }), UsersModule, DepartmentsModule, ImagesModule, AccountModule, LabelModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly service:AppService){
    service.isInit().then(b=>{
      if(!b){
        service.initDB();
      }
    })
  }
}
