import { Injectable, Req, Body } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { files } from '@libs/db/entity/files.entity';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { Override } from '@nestjsx/crud';
import {DeepPartial, Connection} from "typeorm"
import { image } from '@libs/db/entity/Image.entity';
import { label } from '@libs/db/entity/label.entity';

@Injectable()
export class FilesService extends TypeOrmCrudService<files>{
    constructor(@InjectRepository(files) file,@InjectConnection() private dbConnection:Connection){
        super(file)
    }

    @Override("createOneBase")
    async createOne(@Req() req:any,@Body() body:DeepPartial<files>):Promise<files>{
        switch(body.type){
            case("audio/mp3"):
            
        }
        //设置文件标签和示例图片的多对多关系
        let f = await super.createOne(req,body);//执行父类的方法保存文件信息
        const file = await this.dbConnection.manager.findOneOrFail(files,f.id);
        file.desc_image = await this.dbConnection.manager.findByIds(image,body.desc_image);
        file.label = await this.dbConnection.manager.findByIds(label,body.label);
        await this.dbConnection.manager.save(file);
        return Promise.resolve(f);
    }
}
