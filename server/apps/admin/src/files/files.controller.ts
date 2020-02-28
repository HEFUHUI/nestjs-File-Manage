import { Controller, UseGuards, Get } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { files } from '@libs/db/entity/files.entity';
import { FilesService } from './files.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard("jwt"))
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
    constructor(public service:FilesService){}
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
