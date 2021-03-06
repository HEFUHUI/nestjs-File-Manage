import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userinfo } from '@libs/db/entity/users.entity';

@Module({
    imports:[TypeOrmModule.forFeature([userinfo])],
    controllers:[UsersController],
    providers:[UsersService]
})
export class UsersModule {};
