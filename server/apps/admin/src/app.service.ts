import { Injectable } from '@nestjs/common';
import { Connection, QueryFailedError } from 'typeorm';
import { userinfo } from '@libs/db/entity/users.entity';
import { account } from '@libs/db/entity/Account.entity';
import { image } from '@libs/db/entity/Image.entity';
const Users = require("../../../userinfo.json");

@Injectable()
export class AppService {
  private _lock: boolean = false;
  constructor(private db: Connection) { }
  getHello(): string {
    return 'Hello World!';
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
          a.like = u.like || null;
          a.createdAt = u.createdAt;
          a.updateAt = u.updateAt;
          a.info = await this.db.manager.findOne(userinfo, result.id);
          await this.db.manager.save(a)
          if (u.email === process.env.AdminEmail) {
            //设置管理员
            await this.db.manager.update(account, { email: process.env.AdminEmail }, { Grade: 0 })
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
          resolve();
        }
      } catch (error) {
        reject(error)
      }
    })
  }
  async initDB() {
    try {
      await this.insertUser()
      await this.insertImage()
    } catch (error) {
      this.lock = true;
    }
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
