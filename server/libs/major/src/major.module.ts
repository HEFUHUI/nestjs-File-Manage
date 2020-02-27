import { Module } from '@nestjs/common';
import { MajorService } from './major.service';
import { DbModule } from '@libs/db';
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "../../auth/src/auth.module";

@Module({
  imports:[DbModule,ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:".env"
  }),AuthModule],
  providers: [MajorService],
  exports: [MajorService],
})
export class MajorModule {}
