import { Controller, Get, Render } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { files } from '@libs/db/entity/files.entity';

@Controller('files')
export class FilesController {
    constructor(@InjectConnection() private db:Connection){}
    @Get()
    // @Render("files")
    async get(){
        return {files:await this.db.manager.find(files,{relations:["desc_image","label","author"]})};
    }
}
