import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { userinfo } from '@libs/db/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService extends TypeOrmCrudService<userinfo>{
    constructor(@InjectRepository(userinfo) user){
        super(user)
    }
}
