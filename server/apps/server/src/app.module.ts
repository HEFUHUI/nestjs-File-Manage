import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MajorModule } from '@libs/major';
import { EventsGateway } from './events.gateway';
import { FilesModule } from './files/files.module';
import { ProblemModule } from './problem/problem.module';
import { AuthModule } from '@libs/auth';
import { MulterModule } from '@nestjs/platform-express';
import MulterCos = require("multer-cos");

@Module({
  imports: [MajorModule, FilesModule, ProblemModule, AuthModule, MulterModule.registerAsync({
    useFactory() {
      return {
        storage: MulterCos({
          cos: {
            SecretId: process.env.SecretId,
            SecretKey: process.env.SecretKey,
            Bucket: process.env.Bucket,
            Region: process.env.Region,
            dir: process.env.dir
          },
        })
      }
    }
  })],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {
  constructor() { }
}
