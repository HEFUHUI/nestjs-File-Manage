import { Injectable } from '@nestjs/common';
import { Connection, QueryFailedError } from 'typeorm';
import { userinfo } from '@libs/db/entity/users.entity';
import { account } from '@libs/db/entity/account.entity';
import { image } from '@libs/db/entity/image.entity';
import { files } from '@libs/db/entity/files.entity';
import { label } from '@libs/db/entity/label.entity';
const Users = require("../../../userinfo.json");




const BasicFileLabel = [
  {name:"游戏"},
  {name:"视频"},
  {name:"浏览器"},
  {name:"聊天"},
  {name:"输入法"},
  {name:"下载"},
  {name:"音乐"},
  {name:"图片"},
  {name:"安全"},
  {name:"解压刻录"},
  {name:"系统"},
  {name:"驱动"},
  {name:"办公"},
  {name:"编程"},
  {name:"股票网银"},
  {name:"剪辑"},
  {name:"网络"},
  {name:"桌面"},
  {name:"计网出品"},
]


@Injectable()
export class AppService {
  private _lock: boolean = false;
  constructor(private db: Connection) { }
  async saveImage(userid:any,file:any):Promise<image>{
    const img = this.db.getRepository(image)
    return this.db.manager.save(img.create({url:file.url,type:file.mimetype,alias:file.originalname,author:userid,purpose:"file"}));
  }

  ClearSuffixName(name:string):string{
    let arr:string[] =  name.split(".")
    arr.pop();
    return arr.join();
  }

  async insertUser() {
    return new Promise(async (resolve, reject) => {
      try {
        for (let i in Users.userinfo) {
          const u = Users.userinfo[i];
          const user = new userinfo();
          user.member = u.member;
          user.name = u.name;
          user.birthday = u.birthday ? new Date(u.birthday) : null;
          user.class = u.class || null
          user.tie = u.tie || null
          user.dormitory = u.dormitory || null
          user.gender = u.gender || null;
          user.phone = u.phone || null;
          user.insurance = u.insurance || null;
          //添加每一个成员
          const result = await this.db.manager.save(user)
          const a = new account();
          a.email = u.email;
          a.password = u.password[0].password;
          a.motto = u.motto;
          a.Grade = 4;
          a.like = u.like || null;
          a.createdAt = u.createdAt;
          a.updateAt = u.updateAt;
          a.info = await this.db.manager.findOne(userinfo, result.id);
          await this.db.manager.save(a)
          if (u.email === process.env.AdminEmail) {
            //设置管理员
            await this.db.manager.update(account, { email: process.env.AdminEmail }, { Grade: 10 })
          }
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    })
  }
  insertImage(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        for (let i in Users.images) {
          const u = Users.images[i];
          const images = new image();
          images.type = u.type;
          images.createdAt = u.createdAt;
          images.alias = u._id;
          images.url = u.uri;
          images.author = await this.db.manager.findOne(account, { where: { email: u.author[0].email } })
          await this.db.manager.save(images)
        }
        (await this.db.manager.find(account)).forEach(async element=>{
          element.avatar = await this.db.manager.findOne(image,{where:{alias:'5d9e8dc98abe824599b587f4'}})
          element.cover = await this.db.manager.findOne(image,{where:{alias:'5d948e32e415512db1b81c74'}});
          await this.db.manager.save(element);
        })
        resolve();
      } catch (error) {
        reject(error)
      }
    })
  }
  async initDB() {
    try {
      await this.insertUser()
      await this.insertImage()
      await this.insertLabel()
    } catch (error) {
      this.lock = true;
    }
  }
  insertLabel() {
    BasicFileLabel.forEach(async l=>{
      const tag = new label()
      tag.name = l.name;
      await this.db.manager.save(tag);
    })
  }
  set lock(b: boolean) {
    if (b) {
      this.ClearDB();
    }
    this._lock = b;
  };
  async ClearDB() {
    try {
      await this.db.query("drop database if exists demo");
      await this.db.query("create database demo charset=utf8");
    } catch (error) {
    }
  }
  async isInit(): Promise<Boolean> {
    const user = await this.db.manager.find(account, { where: { email: "2981926023@qq.com" } })
    const userInfo = await this.db.manager.find(userinfo);
    return Boolean(user.pop()) && Boolean(userInfo.length >= 54);
  }
}
