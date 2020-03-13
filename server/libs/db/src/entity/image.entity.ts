import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { userinfo } from "./users.entity";
import { ApiProperty } from "@nestjs/swagger";
import { files } from "./files.entity";
import { account } from "./account.entity";

@Entity()
export class image{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @ApiProperty({type:String,required:true,})
    @Column({nullable:false,transformer:{from:val=>val,to:val=>val}})
    url:string

    @Column({default:0,type:"bit"})
    isDelete:string

    @Column({nullable:true})
    type:string

    @Column({name:"alias",nullable:true})
    alias:string

    @Column({type:"bigint",transformer:{to:(val)=>val,from:(val)=>{return val/1024/1024+"M"}}})
    size:number

    @Column({enum:["file","null","currentcy","avatar","cover","icon","user"],type:"enum",default:'null'})
    purpose:string

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