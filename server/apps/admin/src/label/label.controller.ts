import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { label } from '@libs/db/entity/label.entity';
import { LabelService } from './label.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("admin"))
@ApiBearerAuth()
@Crud({
    model: {
        type: label
    }, params: {
        _id: {
            primary: true,
            field: "id",
            type: "uuid"
        }
    },
    query: {
        join: {
            file:{
                eager:true
            }
        }
    }
})
@ApiTags("文件标签管理")    
@Controller('labels')
export class LabelController {
    constructor(public readonly service: LabelService) { }
}
