import { Controller, Get, UseGuards } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { department } from '@libs/db/entity/department.entity';
import { DepartmentsService } from './departments.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Connection } from 'typeorm';
import { userinfo } from '@libs/db/entity/users.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('admin'))
@ApiBearerAuth()
@Crud({
    model:{
        type:department
    },
    params:{
        _id:{
            type:"uuid",
            primary:true,
            field:"id"
        }
    },
    query:{
        join:{
            leader:{
                eager:true
            },
            viceLeader:{
                eager:true
            },
            users:{
                eager:true
            }
        }
    }
})
@ApiTags("部门管理")
@Controller('departments')
export class DepartmentsController {
    constructor(public service:DepartmentsService,private db:Connection){}
    @Get("options")
    async options() {
        return {
            title:"部门管理",
            pagination:false,
            columns: {
                name: {
                    label: "部门名称",
                    type: "input",
                },
            }
        }
    }
}
