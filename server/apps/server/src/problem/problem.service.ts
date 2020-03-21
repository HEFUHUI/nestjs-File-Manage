import { Injectable, NotAcceptableException, UseGuards, NotFoundException } from '@nestjs/common';
import { PublishDto } from './DTO/publish..dto';
import { problem } from '@libs/db/entity/problem.entity';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { account } from '@libs/db/entity/account.entity';
import { answer } from '@libs/db/entity/answer.entity';
import { comment } from '@libs/db/entity/comment.entity';

@Injectable()
export class ProblemService {
    async comment(id: any, user_id: any, body: string): Promise<comment> {
        const Answer = await this.db.manager.findOne(answer,id,{where:{isDelete:0}});
        if(Answer===undefined) throw new NotFoundException("未找到回复");
        const Comment = this.db.manager.create(comment,{author:user_id as account,answer:id as answer,body})
        return await this.db.manager.save(Comment)
    }
    async support(user_id: string, id: string):Promise<answer>{
        const Answer = this.db.getRepository(answer);
        const c_answer = await this.db.manager.findOne(answer,id,{relations:["support"]})
        c_answer.support.push(await this.db.manager.findOne(account,user_id));
        return await Answer.save(c_answer);
    }
    async ReplyProblem(req: any, body: { content: string; }):Promise<answer> {
        const Answer = new answer()
        Answer.author = req.user.id;
        Answer.content = body.content;
        Answer.proplem = await this.db.manager.findOne(problem,req.params.id,{where:{isDelete:0}});
        return await this.db.manager.save(Answer)
    }
    
    async getProblemItem(id: string):Promise<problem>{
        return  this.db.manager.findOne(problem,id,{where:{isDelete:0},
            relations:["author","author.avatar","answer","answer.comment","answer.author","answer.author.avatar","answer.comment.author","answer.comment.author.avatar"],
        })
    }
    
    async deleteProblem(id: string,user_id:string):Promise<problem> {
        const p = await this.db.manager.findOne(problem,id,{where:{author:user_id}})
        if(p == null){
            throw new NotAcceptableException("这个问题是别人提的哦")
        }
        p.isDelete = 1;
        return this.db.manager.save(p);
    }

    async getProblem():Promise<problem[]>{
        return await this.db.manager.find(problem,{relations:["author","author.avatar"],where:{isDelete:0}});
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
