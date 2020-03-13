import { Controller, Get, UseGuards } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { account } from '@libs/db/entity/account.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('admin'))
@ApiBearerAuth()
@Crud({
    model:{
        type:account
    },
    params:{
        _id:{
            type:"uuid",
            field:"id",
            primary:true
        }
    },
    query:{
        exclude:["password"],
        join:{
            avatar:{
                eager:true
            },
            info:{
                eager:true
            }
        }
    }
})
@ApiTags("账户管理")
@Controller('account')
export class AccountController {
    constructor(private readonly service:AccountService){
        
    }
    @Get("options")
    async options() {
        return {
            title:"账户管理",
            pagination:true,
            stops:{
                10:"管理员",
                8 :"部长",
                6 :"干部",
                4 :"成员",
                2 :"资深游客",
                0 :"游客",
            },
            columns: {
                nickName: {
                    label: "昵称",
                    type: "input"
                },
                email: {
                    disabled:true,
                    label: "邮箱",
                    width:"200",
                    type: "input"
                },
                like: {
                    label: "爱好",
                    type: "input"
                },
                motto: {
                    label: "座右铭",
                    type: "input"
                },
                password: {
                    listShow:false,
                    label: "密码",
                    type: "password"
                },
            }
        }
    }
}
