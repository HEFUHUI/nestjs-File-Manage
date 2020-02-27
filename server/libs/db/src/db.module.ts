import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import {} from "typeorm"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ormconfig } from 'ormconfig';

@Module({
  imports:[TypeOrmModule.forRoot(ormconfig)],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
