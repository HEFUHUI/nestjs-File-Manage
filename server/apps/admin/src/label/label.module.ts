import { Module } from '@nestjs/common';
import { LabelService } from './label.service';
import { LabelController } from './label.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { label } from '@libs/db/entity/label.entity';

@Module({
  imports:[TypeOrmModule.forFeature([label])],
  providers: [LabelService],
  controllers: [LabelController]
})
export class LabelModule {}
