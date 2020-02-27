import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { files } from '@libs/db/entity/files.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FilesService extends TypeOrmCrudService<files>{
    constructor(@InjectRepository(files) file){
        super(file)
    }
}
