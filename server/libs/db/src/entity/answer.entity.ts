import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { account } from "./account.entity";
import { problem } from "./problem.entity";
import { comment } from "./comment.entity";

@Entity()
export class answer{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column("longtext")
    content:string

    @Column({default:0,type:"bit"})
    isDelete:number

    @JoinColumn()
    @OneToMany(t=>comment,t=>t.answer)
    comment:comment[]

    @ManyToMany(t=>account,t=>t.supportAnswer)
    @JoinTable({
        name:"answer_account",
        joinColumns:[
            {name:"answer_id"}
        ],
        inverseJoinColumns:[
            {name:'account_id'}
        ]
    })
    support:account[]

    @ManyToOne(t=>problem,t=>t.id)
    @JoinColumn()
    proplem:problem

    @ManyToOne(t=>account,t=>t.id,{nullable:true})
    @JoinColumn()
    author:account

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