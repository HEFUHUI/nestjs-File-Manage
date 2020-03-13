import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { image } from "./image.entity";
import { label } from "./label.entity";
import { account } from "./account.entity";

@Entity()
export class files{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @ApiProperty({type:String,required:true,})
    @Column({nullable:false})
    url:string

    @Column({nullable:true,default:'exe'})
    type:string

    @Column({default:0,type:"bit"})
    isDelete:string

    @Column({default:"private",enum:["public","private"],type:"enum"})
    share:string

    @Column({type:"bigint",default:0,transformer:{to:()=>{},from:(val)=>{
        return val/1024/1024+"M"
    }}})
    size:number

    @Column({name:"name",nullable:true})
    name:string

    @Column({nullable:true})
    description:string

    @Column({nullable:true})
    icon:string

    @ManyToMany(t=>image,t=>t.file)
    @JoinTable({
        name:"file_image",
        joinColumns:[
            {name:"file_id"}
        ],
        inverseJoinColumns:[
            {name:'image_id'}
        ]
    })
    desc_image:image[]

    @ManyToMany(t=>account,t=>t.collection)
    @JoinTable({
        name:"file_account",
        joinColumns:[
            {name:"file_id"}
        ],
        inverseJoinColumns:[
            {name:'user_id'}
        ]
    })
    collection:account[]

    @ManyToOne(t=>account,t=>t.id,{nullable:false})
    @JoinColumn({name:"user_id"})
    author:account

    @ManyToMany(t=>label,t=>t.file)
    @JoinTable({
        name:"file_label",
        joinColumns:[
            {name:"file_id"}
        ],
        inverseJoinColumns:[
            {name:'label_id'}
        ]
    })
    label:label[]


    @Column({onUpdate:"CURRENT_TIMESTAMP",default:()=>"CURRENT_TIMESTAMP",name:"update_at",type:'timestamp'})
    updateAt:Date

    @Column("timestamp",{default:()=>"CURRENT_TIMESTAMP",name:"created_at"})
    createdAt:Date
}