import { Controller, Post, Body, Req, UseGuards, Get, Delete, Param, Put } from '@nestjs/common';
import { PublishDto } from './DTO/publish..dto';
import { problem } from '@libs/db/entity/problem.entity';
import { ProblemService } from './problem.service';
import { AuthGuard } from '@nestjs/passport';
import { answer } from '@libs/db/entity/answer.entity';
import { getId } from './DTO/getId.dto';
import { comment } from '@libs/db/entity/comment.entity';

@Controller('problem')
export class ProblemController {
    constructor(private service:ProblemService){}
    @Post()
    @UseGuards(AuthGuard("web"))
    async publish(@Body() p:PublishDto,@Req() req:any):Promise<problem>{
        return this.service.publish(p,req.user.id);
    }
    @Get()
    async getProblem():Promise<problem[]>{
        return await this.service.getProblem()
    }

    @Get(":id")
    async getProblemItem(@Param() p:getId):Promise<problem>{
        return await this.service.getProblemItem(p.id);
    }

    @Delete(":id")
    @UseGuards(AuthGuard("web"))
    async deleteProblem(@Param() p:getId,@Req() req:any):Promise<problem>{
        return await this.service.deleteProblem(p.id,req.user.id)
    }

    @Put("support/:id")
    @UseGuards(AuthGuard('web'))
    async supportAnswer(@Req() req:any,@Param() params:getId):Promise<answer>{
        return await this.service.support(req.user.id as string,params.id);
    }

    @Post(":id")
    @UseGuards(AuthGuard("web"))
    async ReplyProblem(@Req() req:any,@Body() body:{content:string}):Promise<answer>{
        return await this.service.ReplyProblem(req,body)
    }

    @Put("comment/:id")
    @UseGuards(AuthGuard("web"))
    comment(@Req() req:any,@Param() p:getId):Promise<comment>{
        console.log(req.body.body as string)
        return this.service.comment(p.id,req.user.id as string,req.body.body as string);
    }
}