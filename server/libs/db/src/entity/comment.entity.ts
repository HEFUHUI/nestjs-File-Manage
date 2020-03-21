import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, UpdateDateColumn, CreateDateColumn, OneToOne, OneToMany } from "typeorm";
import { account } from "./account.entity";
import { answer } from "./answer.entity";

@Entity()
export class comment{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column()
    body:string

    @Column({default:0,type:"bit"})
    isDelete:number

    @JoinColumn()
    @ManyToOne(t=>answer,t=>t.id)    
    answer:answer

    @ManyToOne(t=>account,t=>t.id)
    @JoinColumn()
    author:account

    @ManyToOne(t=>comment,t=>t.child,{nullable:true,onDelete:"SET NULL"})
    @JoinColumn()
    reply:comment

    @OneToMany(t=>comment,t=>t.reply)
    child:comment[]

    @UpdateDateColumn({transformer:{
        from:val=>new Date(val).toLocaleString(),to:val=>val
    }})
    updateAt:Date

    @CreateDateColumn({transformer:{
        from:val=>new Date(val).toLocaleString(),to:val=>val
    }})
    createdAt:Date
}