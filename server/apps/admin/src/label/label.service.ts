import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { label } from '@libs/db/entity/label.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LabelService extends TypeOrmCrudService<label> {
    constructor(@InjectRepository(label) label){
        super(label);
    }
}
