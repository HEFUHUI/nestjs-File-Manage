import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { account } from "./account.entity";
import { problem } from "./problem.entity";
import { comment } from "./comment.entity";

@Entity()
export class answer{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column()
    content:string

    @JoinColumn()
    @OneToMany(t=>comment,t=>t.answer)
    comment:comment

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
    proplem:string

    @ManyToOne(t=>account,t=>t.id)
    @JoinColumn()
    author:account

    @Column({onUpdate:"CURRENT_TIMESTAMP",default:()=>"CURRENT_TIMESTAMP",name:"update_at",type:'timestamp'})
    updateAt:Date

    @Column("timestamp",{default:()=>"CURRENT_TIMESTAMP",name:"created_at"})
    createdAt:Date
}