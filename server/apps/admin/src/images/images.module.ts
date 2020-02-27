import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { image } from '@libs/db/entity/Image.entity';

@Module({
  imports:[TypeOrmModule.forFeature([image])],
  controllers: [ImagesController],
  providers:[ImagesService],
  exports:[ImagesService]
})
export class ImagesModule {}
