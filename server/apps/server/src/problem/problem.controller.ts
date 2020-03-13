import { Controller, Post, Body, Req, UseGuards, Get, Delete, Param } from '@nestjs/common';
import { PublishDto } from './DTO/publish..dto';
import { problem } from '@libs/db/entity/problem.entity';
import { ProblemService } from './problem.service';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm';

@Controller('problem')
@UseGuards(AuthGuard("web"))
export class ProblemController {
    constructor(private service:ProblemService){}
    @Post()
    async publish(@Body() p:PublishDto,@Req() req:any):Promise<problem>{
        return this.service.publish(p,req.user.id);
    }
    @Get()
    async getProblem():Promise<problem[]>{
        return await this.service.getProblem()
    }
    @Delete(":id")
    async deleteProblem(@Param() p:{id:string}):Promise<DeleteResult>{
        return await this.service.deleteProblem(p.id)
    }
}
