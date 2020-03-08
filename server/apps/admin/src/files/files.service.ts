import { Injectable, Req, Body } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { files } from '@libs/db/entity/files.entity';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { Override } from '@nestjsx/crud';
import {DeepPartial, Connection} from "typeorm"
import { image } from '@libs/db/entity/Image.entity';
import { label } from '@libs/db/entity/label.entity';


const IconEnum = {
    mp3:"http://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/files/a7b9bc3fdc22ac2bf89c33a5a75bf27d.png",
    app:'http://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/files/8f172a08e99a8ef869cc044dcf5ae12d.png',
    windows:"http://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/files/62cc6452856fe7fb0e282671ab43c293.png",
    linux:"http://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/files/981e9ec893cabec38b96915cbd0902a4.png",
    android:"http://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/files/224da403741eb83441f53638eecc9058.png",
    zip:'http://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/files/c82c1bd7829a66a16923235b773258ad.png',
    rar:"http://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/files/3d2edcbb118c8b244f8033a335dbf791.png",
    mac:'http://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/files/c7c3667f239201df460c097f4696966b.png',
    music:"http://hefuhui-1258205592.cos.ap-guangzhou.myqcloud.com/files/77469b2cc86900bc2117b6332dcc091b.png"
}

@Injectable()
export class FilesService extends TypeOrmCrudService<files>{
    constructor(@InjectRepository(files) file,@InjectConnection() private dbConnection:Connection){
        super(file)
    }
    @Override("createOneBase")
    async createOne(@Req() req:any,@Body() body:DeepPartial<files>):Promise<files>{
        console.log(body);
        if(!body.icon){
            switch(body.type){
                case("audio/mp3"):
                    body.icon = IconEnum.mp3;
                    break;
                case("application/x-ms-dos-executable"):
                    body.icon = IconEnum.windows;
                case("application/vnd.android.package-archive"):
                    body.icon = IconEnum.android;
                case("application/zip"):
                    body.icon = IconEnum.zip;
                default:
                    if(/^audio/.test(body.type)){
                        body.icon = IconEnum.music;
                    }else{
                        body.icon = IconEnum.app;
                    }
            }
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
