import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, Db } from 'typeorm';
import { account } from '@libs/db/entity/account.entity';
import { UnauthorizedException } from '@nestjs/common';


export class MyGuards extends PassportStrategy(Strategy,"web") {
  constructor(
    @InjectConnection() private db:Connection,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
      ignoreExpiration:false,
      } as StrategyOptions);
  }

  async validate(result:any) {
    const user = await this.db.manager.findOne(account,result.id,{relations:["avatar","cover","info","collection"],where:{email:result.email}});
    if(user === null){
      throw new UnauthorizedException(`登录异常.请重新登录.`)
    }
    if(user.state === "disabled"){
      throw new UnauthorizedException(`用户${user.email}已被禁用`)
    }
    if(user.password === result.password){
      return user;
    }else{
      throw new UnauthorizedException();
    }
  }
}
