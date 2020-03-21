import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { userinfo } from "./users.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class department {
    @PrimaryGeneratedColumn("uuid")
    id:string

    @ApiProperty({type:String,default:"技术部"})
    @Column({name:"name",comment:"部门名称"})
    name:string

    @Column({default:0,type:"bit"})
    isDelete:number
    
    @OneToOne(t=>userinfo,{nullable:true})
    @JoinColumn()
    leader:userinfo

    @OneToOne(t=>userinfo,{nullable:true})
    @JoinColumn()
    viceLeader:userinfo

    @UpdateDateColumn({transformer:{
        from:val=>new Date(val).toLocaleString(),
        to:val=>val
    }})
    updateAt:Date

    @CreateDateColumn({transformer:{
        from:val=>new Date(val).toLocaleString(),
        to:val=>val
    }})
    createdAt:number

    @OneToMany(t=>userinfo,t=>t.department)
    @JoinColumn({name:"user_id"})
    users:userinfo[]
}