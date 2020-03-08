import { Controller, UseGuards, Get } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { files } from '@libs/db/entity/files.entity';
import { FilesService } from './files.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("admin"))
@ApiBearerAuth()
@Crud({
    model:{
        type:files
    },
    params: {
        _id: {
            primary: true,
            field: "id",
            type: "uuid"
        }
    },
    query: {
        join: {
            label: {
                eager: true
            },
            author: {
                eager: true
            },
            desc_image:{
                eager:true
            }
        }
    }
})
@ApiTags("文件管理")
@Controller('files')
export class FilesController {
    constructor(public service:FilesService,@InjectConnection() private dbConnection:Connection){}
    @Get("options")
    async options() {
        return {
            title:"文件管理",
            pagination:true,
            columns: {
                name:{
                    label:'文件名称',
                    type:"input"
                }
            }
        }
    }
}
