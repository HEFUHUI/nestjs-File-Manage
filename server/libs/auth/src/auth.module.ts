import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './token.stratrgy';
import {JwtModule} from "@nestjs/jwt"

@Module({
  imports:[PassportModule,JwtModule.registerAsync({
    useFactory(){
      return {
        secret:process.env.AdminSECRET,
        signOptions: {expiresIn:1000*1000 },
      }
    }
  })],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy]
})
export class AuthModule {}
