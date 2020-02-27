import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { userinfo } from "./users.entity";
import { ApiProperty } from "@nestjs/swagger";
import { image } from "./Image.entity";
import { label } from "./label.entity";

@Entity()
export class files{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @ApiProperty({type:String,required:true,})
    @Column({nullable:false})
    url:string

    @Column({nullable:true,default:'exe'})
    type:string

    @Column({default:"private",enum:["public","private"],type:"enum"})
    share:string

    @Column({name:"name",nullable:true})
    name:string

    @Column({nullable:true})
    description:string

    @ManyToMany(t=>image,t=>t.file)
    @JoinColumn()
    desc_images:image[]

    @ManyToOne(t=>userinfo,t=>t.id,{nullable:false})
    @JoinColumn({name:"user_id"})
    author:userinfo

    @ManyToMany(t=>label,t=>t.file)
    @JoinColumn()
    labels:label[]

    @Column({onUpdate:"CURRENT_TIMESTAMP",default:()=>"CURRENT_TIMESTAMP",name:"update_at",type:'timestamp'})
    updateAt:Date

    @Column("timestamp",{default:()=>"CURRENT_TIMESTAMP",name:"created_at"})
    createdAt:Date
}