import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { image } from '@libs/db/entity/image.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImagesService extends TypeOrmCrudService<image>{
    constructor(@InjectRepository(image) image){
        super(image)
    }
    
}
