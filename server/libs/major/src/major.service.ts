import { Injectable } from '@nestjs/common';
import * as COS from "cos-nodejs-sdk-v5"
import Mail = require('nodemailer/lib/mailer');

@Injectable()
export class MajorService {
    public cos:any
    public transport:Mail
    CosInit():void{
        this.cos = new COS({
            SecretId: process.env.SecretId,
            SecretKey: process.env.SecretKey,
        });
    }
    getCosImg():Promise<any>{
        this.CosInit();
        return new Promise((resolve,reject)=>{
            this.cos.getBucket({
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
