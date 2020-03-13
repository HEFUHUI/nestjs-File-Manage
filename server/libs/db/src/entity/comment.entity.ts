import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { account } from "./account.entity";
import { answer } from "./answer.entity";

@Entity()
export class comment{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column()
    body:string

    @JoinColumn()
    @ManyToOne(t=>answer,t=>t.id)    
    answer:answer

    @ManyToOne(t=>account,t=>t.id)
    @JoinColumn()
    author:account

    @Column({onUpdate:"CURRENT_TIMESTAMP",default:()=>"CURRENT_TIMESTAMP",name:"update_at",type:'timestamp'})
    updateAt:Date

    @Column("timestamp",{default:()=>"CURRENT_TIMESTAMP",name:"created_at"})
    createdAt:Date
}