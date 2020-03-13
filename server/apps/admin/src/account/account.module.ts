import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { account } from '@libs/db/entity/account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Module({
    imports:[TypeOrmModule.forFeature([account])],
    controllers:[AccountController],
    providers:[AccountService]
})
export class AccountModule {}
