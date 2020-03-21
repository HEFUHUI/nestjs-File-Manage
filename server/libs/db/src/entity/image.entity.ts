import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { userinfo } from "./users.entity";
import { ApiProperty } from "@nestjs/swagger";
import { files } from "./files.entity";
import { account } from "./account.entity";

@Entity()
export class image{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @ApiProperty({type:String,required:true,})
    @Column({nullable:false,transformer:{from:val=>{
        return /^(http|https|ftp)/.test(val) ? val : 'http://'+val;
    },to:val=>val}})
    url:string

    @Column({default:0,type:"bit"})
    isDelete:number

    @Column({nullable:true})
    type:string

    @Column({name:"alias",nullable:true})
    alias:string

    @Column({enum:["file","null","currentcy","avatar","cover","icon","user"],type:"enum",default:'null'})
    purpose:string

    @ManyToOne(t=>account,t=>t.id,{nullable:true})
    @JoinColumn({name:"author"})
    author:account

    @ManyToMany(t=>files,t=>t.desc_image,{cascade:true})
    file:files[]

    @UpdateDateColumn({transformer:{
        from:val=>new Date(val).toLocaleString(),
        to:val=>val
    }})
    updateAt:Date

    @CreateDateColumn({transformer:{
        from:val=>new Date(val).toLocaleString(),
        to:val=>val
    }})
    createdAt:Date
}