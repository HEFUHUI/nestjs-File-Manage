import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { account } from '@libs/db/entity/Account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountService extends TypeOrmCrudService<account>{
    constructor(@InjectRepository(account) account){
        super(account)
    }
}
