import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, Db } from 'typeorm';
import { account } from '@libs/db/entity/account.entity';
import { compareSync } from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';


export class JwtStrategy extends PassportStrategy(Strategy,"admin") {
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
    const user = await this.db.manager.findOne(account,result.id,{relations:["avatar","cover","info"],where:{email:result.email}});
    if(user && user.Grade >= 8 && user.password === result.password){
      return user;
    }else{
      throw new UnauthorizedException();
    }
  }
}
