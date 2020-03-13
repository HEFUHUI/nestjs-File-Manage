import { Injectable } from '@nestjs/common';
import { PublishDto } from './DTO/publish..dto';
import { problem } from '@libs/db/entity/problem.entity';
import { Connection, DeleteResult } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { account } from '@libs/db/entity/account.entity';

@Injectable()
export class ProblemService {
    async deleteProblem(id: string):Promise<DeleteResult> {
        return this.db.manager.delete(problem,id)
    }
    async getProblem():Promise<problem[]>{
        return await this.db.manager.find(problem,{relations:["author","author.avatar"]});
    }
    constructor(@InjectConnection() private readonly db:Connection){}
    async publish(p:PublishDto,author:string):Promise<problem>{
        const source = new problem();
        source.author = await this.db.manager.findOne(account,author);
        source.body = p.body;
        source.ex_img = p.ex_img;
        return this.db.manager.save(source);
    }
}
