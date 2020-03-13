import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './admin.stratrgy';
import {JwtModule} from "@nestjs/jwt"
import { MyGuards } from './web.stratrgy';
import { MajorModule } from '@libs/major';

@Module({
  imports:[PassportModule,forwardRef(()=>MajorModule),JwtModule.registerAsync({
    useFactory(){
      return {
        secret:process.env.SECRET,
        signOptions: {expiresIn:1000*1000 },
      }
    }
  })],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy,MyGuards]
})
export class AuthModule {}
