import { Controller, UseGuards, Get } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { image } from '@libs/db/entity/image.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { AuthGuard } from '@nestjs/passport';
import { MajorService } from '@libs/major';

@UseGuards(AuthGuard('admin'))
@ApiBearerAuth()
@Crud({
    model:{
        type:image
    },
    params:{
        _id:{
            type:'uuid',
            primary:true,
            field:"id"
        }
    },
    query:{
        join:{
            author:{
                alias:"author",
                allow:["nickName","id","email"],
                eager:true
            }
        }
    }
})
@ApiTags("图片管理")
@Controller('images')
export class ImagesController {
    constructor(public service:ImagesService,private majorService:MajorService){}
    @Get("cos")
    async getCosImg(){
      return await this.majorService.getCosImg()
    }
}
