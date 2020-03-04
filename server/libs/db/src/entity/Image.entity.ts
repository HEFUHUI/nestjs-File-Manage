import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { userinfo } from "./users.entity";
import { ApiProperty } from "@nestjs/swagger";
import { files } from "./files.entity";
import { account } from "./Account.entity";

@Entity()
export class image{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @ApiProperty({type:String,required:true,})
    @Column({nullable:false,transformer:{from:val=>val,to:val=>val}})
    url:string

    @Column({nullable:true})
    type:string

    @Column({name:"alias",nullable:true})
    alias:string

    @ManyToOne(t=>account,t=>t.id,{nullable:true})
    @JoinColumn({name:"author"})
    author:account

    @ManyToMany(t=>files,t=>t.desc_image,{cascade:true})
    file:files[]

    @Column({onUpdate:"CURRENT_TIMESTAMP",default:()=>"CURRENT_TIMESTAMP",name:"update_at",type:'timestamp'})
    updateAt:Date

    @Column("timestamp",{default:()=>"CURRENT_TIMESTAMP",name:"created_at"})
    createdAt:Date
}