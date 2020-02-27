import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { department } from '@libs/db/entity/department.entity';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';

@Module({
    imports:[TypeOrmModule.forFeature([department])],
    controllers:[DepartmentsController],
    providers:[DepartmentsService]
})
export class DepartmentsModule {}
