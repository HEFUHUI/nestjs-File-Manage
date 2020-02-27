import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { files } from '@libs/db/entity/files.entity';

@Module({
  imports:[TypeOrmModule.forFeature([files])],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
