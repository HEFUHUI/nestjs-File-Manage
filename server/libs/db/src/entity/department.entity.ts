import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne, ManyToOne } from "typeorm";
import { userinfo } from "./users.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class department {
    @PrimaryGeneratedColumn("uuid")
    id:string

    @ApiProperty({type:String,default:"技术部"})
    @Column({name:"name",comment:"部门名称"})
    name:string

    @OneToOne(t=>userinfo,{nullable:true})
    @JoinColumn()
    leader:userinfo

    @OneToOne(t=>userinfo,{nullable:true})
    @JoinColumn()
    viceLeader:userinfo

    @Column({onUpdate:"CURRENT_TIMESTAMP",default:()=>"CURRENT_TIMESTAMP",name:"update_at",type:'timestamp'})
    updateAt:Date

    @Column("timestamp",{default:()=>"CURRENT_TIMESTAMP",name:"created_at"})
    createdAt:Date

    @OneToMany(t=>userinfo,t=>t.department)
    @JoinColumn({name:"user_id"})
    users:userinfo[]
}