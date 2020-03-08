import { Controller, Get, Render, Put, UseGuards, Req, Query } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { files } from '@libs/db/entity/files.entity';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
    constructor(@InjectConnection() private db:Connection,private readonly service:FilesService){}
    @Get()
    // @Render("files")
    async get(){
        return {
            files:[]
            // files:await this.service.getFiles()
        };
    }

    @Put()
    @UseGuards(AuthGuard("web"))
    async collection(@Req() req:any,@Query() query:any){
        // return await this.service.setCollection(query.fileid,req.user.id);    
    }
}
