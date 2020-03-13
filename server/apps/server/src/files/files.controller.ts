import { Controller, Get, Put, UseGuards, Req, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';
import { label } from '@libs/db/entity/label.entity';

@Controller('files')
export class FilesController {
    constructor(private readonly service:FilesService){}
    @Get()
    // @Render("files")
    async get(){
        return {
            files:await this.service.getFiles()
        };
    }

    @Get("labels")
    async getLabel():Promise<label[]>{
        return await this.service.getLabels()
    }

    @Put("collection/:id")
    @UseGuards(AuthGuard("web"))
    async collection(@Req() req:any,@Param() param:any){
        return await this.service.setCollection(param.id,req.user.id);    
    }
}
