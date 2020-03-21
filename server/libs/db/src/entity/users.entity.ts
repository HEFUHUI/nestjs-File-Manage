import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { department } from "./department.entity";
import { image } from "./image.entity";
import { ApiProperty } from "@nestjs/swagger";
import { account } from "./account.entity";

@Entity()
export class userinfo{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column({default:0,type:"bit"})
    isDelete:number

    @ApiProperty()
    @Column()
    name:string

    @ApiProperty({type:"enum",enum:["男","女"]})
    @Column({type:"enum",enum:["男","女"],default:"男"})
    gender:string

    @Column({comment:"班级",nullable:true})
    class:string

    @Column({type:"enum",comment:"系别",
    enum: ['信息艺术设计系', '机电装备产业系', '物流商贸产业系', '智能制造产业系', '智能控制产业系'],default:"信息艺术设计系"})
    tie:string

    @Column({type:"enum",enum:["是","否"],comment:"是否购买意外险",default:"否"})
    insurance: string

    @Column({comment:"宿舍号",type:"varchar",nullable:true})
    dormitory:string

    @Column({type:"enum",enum:["群众","团员","党员"],comment:"政治面貌",nullable:true})
    member:string

    @Column({type:"char",length:11,nullable:true})
    phone:string

    @Column({type:"date",nullable:true,default:"2019-10-10"})
    birthday:Date

    @OneToOne(t=>department,t=>t.leader)
    leader:department

    @OneToOne(t=>department,t=>t.viceLeader)
    viceLeader:department

    @ApiProperty()
    @OneToMany(t=>account,t=>t.info,{nullable:true})
    @JoinColumn()
    account:account[]

    @ManyToOne<department>(t=>department,t=>t.users)
    @JoinColumn({name:"department",referencedColumnName:"id"})
    department:department

    @UpdateDateColumn({transformer:{
        from:val=>new Date(val).toLocaleString(),
        to:val=>val
    }})
    updateAt:Date

    @OneToMany(t=>image,t=>t.author,{nullable:true})
    @JoinColumn()
    images:image[]

    @CreateDateColumn({transformer:{
        from:val=>new Date(val).toLocaleString(),
        to:val=>val
    }})
    createdAt:Date
}