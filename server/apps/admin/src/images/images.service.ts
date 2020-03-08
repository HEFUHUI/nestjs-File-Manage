import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { image } from '@libs/db/entity/Image.entity';
import { InjectRepository } from '@nestjs/typeorm';

var COS = require('cos-nodejs-sdk-v5');
var cos = new COS({
    SecretId: process.env.SecretId,
    SecretKey: process.env.SecretKey,
});

@Injectable()
export class ImagesService extends TypeOrmCrudService<image>{
    constructor(@InjectRepository(image) image){
        super(image)
    }
    getCosImg():Promise<any>{
        return new Promise((resolve,reject)=>{
            cos.getBucket({
                Bucket: process.env.Bucket,
                Region: process.env.Region, 
                Prefix: process.env.dir, 
            }, function(err:Error, data:any) {
                if(err){
                   reject(err.message)
                }else{
                    resolve(data.Contents)
                }
            });
        })
    }
}
