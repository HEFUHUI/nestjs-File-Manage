import { Strategy, IStrategyOptions } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';
import {compareSync} from 'bcrypt'
import { account } from '@libs/db/entity/Account.entity';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(@InjectConnection() private db:Connection) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      session:true
    } as IStrategyOptions);
  }

  async validate(email: string, password: string) {
    const user = await this.db.manager.findOne(account,{where:{email}})
    if (!user) {
      throw new UnauthorizedException('用户名或者密码不正确');
    }
    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException('用户名或者密码不正确')
    }
    if(user.Grade>500){
      throw new UnauthorizedException("请以管理员身份登录");
    }
    return user;
  }
}
