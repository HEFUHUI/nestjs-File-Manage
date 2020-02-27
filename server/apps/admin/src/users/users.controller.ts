import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Crud } from "@nestjsx/crud"
import { userinfo } from '@libs/db/entity/users.entity';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Connection } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Crud({
    model: {
        type: userinfo
    },
    params: {
        _id: {
            primary: true,
            field: "id",
            type: "uuid"
        }
    },
    query: {
        join: {
            images: {
                eager: true
            },
            account: {
                eager: true
            },
            department:{
                eager:true
            }
        }
    }
})
@ApiTags("用户管理")
@Controller('users')
export class UsersController {
    constructor(public service: UsersService, private readonly db: Connection) { }
    @Get("options")
    async options() {
        let tieOptions = [
            "信息艺术设计系",
            "机电装备产业系",
            "物流商贸产业系",
            "智能制造产业系",
            "智能控制产业系"
        ]
        return {
            title:"所有成员",
            pagination:true,
            columns: {
                name: {
                    label: "姓名",
                    width: 100,
                    type: "input"
                },
                class: { label: "班级", type: "input" },
                tie: {
                    label: "系别",
                    type: "select",
                    options: () => {
                        let arr = [];
                        tieOptions.forEach(element => {
                            arr.push({ text: element, value: element });
                        });
                        return arr;
                    }
                },
                birthday: {
                    attrs: {
                        "valueFormat": "yyyy-MM-DD",
                    },
                    type: "date",
                    label: "出生年月",
                },
                dormitory: { label: "宿舍号", type: "input" },
                member: {
                    label: "政治面貌",
                    type: "select",
                    options: [
                        { text: "团员", value: "团员" },
                        { text: "党员", value: "党员" },
                        { text: "群众", value: "群众" }
                    ]
                },
                insurance: {
                    label: "是否购买意外险",
                    type: "select",
                    options: [
                        { text: "是", value: "是" },
                        { text: "否", value: "否" }
                    ]
                },
                phone: {
                    label: "手机号",
                    type: "input"
                },
                gender: {
                    label: "性别",
                    width: 70,
                    type: "select",
                    options: [
                        { text: "女", value: "女" },
                        { text: "男", value: "男" }
                    ]
                }
            }, tieOptions
        }
    }
}
