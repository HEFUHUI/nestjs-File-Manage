import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { image } from '@libs/db/entity/image.entity';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly db:Connection){}
  getHello(): string {
    return 'Hello World!';
  }

  async getImages(user_id:string):Promise<image[]>{
    return await this.db.manager.find(image,{where:{author:user_id}})
  }
  async getImagesWithPagination(user_id:string,page:number,limit:number):Promise<any>{
    const images = await this.db.manager.findAndCount(image,{where:{author:user_id},take:limit,skip:page,cache:true})
    return {
      total:images.pop(),
      data:images.pop()
    }
  }

}
