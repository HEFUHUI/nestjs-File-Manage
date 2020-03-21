import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToOne, ManyToMany, UpdateDateColumn, CreateDateColumn, JoinTable } from "typeorm";
import { account } from "./account.entity";

@Entity()
export class notice{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column({default:0,type:"bit"})
    isDelete:number

    @Column({type:"enum",enum:["link","image","text","innerLink"],default:"text"})
    type:string

    @Column({nullable:false,enum:["系统消息","关注消息","用户消息"],type:"enum"})
    title:string

    @Column({nullable:false})
    content:string

    @Column({name:"sub_title",nullable:true})
    sub_title:string

    @ManyToOne(t=>account,t=>t.id)
    @JoinColumn()
    creater:account

    @Column({type:"enum",enum:["Read","Unread"],default:"Unread"})
    look_up:string

    @ManyToMany(t=>account)
    @JoinTable({
        name:"notice_account",
        joinColumns:[
            {name:"notice"}
        ],
        inverseJoinColumns:[
            {name:'account'}
        ]
    })
    receive:account[]

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