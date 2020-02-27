import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { department } from '@libs/db/entity/department.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DepartmentsService extends TypeOrmCrudService<department>{
    constructor(@InjectRepository(department) department){
        super(department);
    }
}
