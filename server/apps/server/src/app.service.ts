import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, UpdateResult } from 'typeorm';
import { image } from '@libs/db/entity/image.entity';
import { account } from '@libs/db/entity/account.entity';
import { verify, JsonWebTokenError } from 'jsonwebtoken';
import { parse } from 'url';

@Injectable()
export class AppService {
  async search(wd: string): Promise<any> {
    return 
  }
  async getUserInfo(id: string):Promise<account>{
    const c_user = await this.db.manager.findOne(account,id,
      {where:{isDelete:0},
      select:["nickName","online","createdAt","motto","like","id","email"],
      relations:["avatar","cover","support","collection"]
    });
    if(!c_user)throw new NotFoundException("用户不存在或者已被删除!")
    return c_user;
  }
  constructor(@InjectConnection() private readonly db: Connection) { }

  public OnlineUsers:{
    [socketId:string]:account
  }

  async getImages(user_id: string): Promise<image[]> {
    return await this.db.manager.find(image, { where: { author: user_id } })
  }

  async getImagesWithPagination(user_id: string, page: number, limit: number): Promise<any> {
    const images = await this.db.manager.findAndCount(image, { where: { author: user_id }, take: limit, skip: (page-1)*limit})
    return {total: images.pop(),data: images.pop()}
  }
  
  async checkToken(token: string | null) {
    return new Promise((resolve, reject) => {
      if (!token) return reject(new JsonWebTokenError("token is not found"))
      verify(token, process.env.SECRET, (err: Error, payload: any) => {
        if (err) return reject(err)
        resolve(payload)
      });
    })
  }

  getToken(url: string): string | null {
    return parse(url, true).query.token as string;
  }

  async online(user_id: string, socket_id: string): Promise<UpdateResult> {
    const c_user = await this.db.manager.findOne(account,user_id,{where:{state:'enabled'}});
    if(!this.OnlineUsers){
      this.OnlineUsers ={};
      this.OnlineUsers[socket_id] = c_user
    }
    return this.db.getRepository(account).update(c_user, { socketid: socket_id, online: 1 })
  }

  async offline(socketid: string) {
    if(this.OnlineUsers[socketid]){
      const c_user = await this.db.manager.findOne(account,this.OnlineUsers[socketid].id);
      delete this.OnlineUsers[socketid]
      return this.db.getRepository(account).update(c_user, { socketid: "", online: 0 })
    }
  }
}
