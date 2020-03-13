import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { account } from "./account.entity";
import { answer } from "./answer.entity";

@Entity()
export class problem{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column({nullable:false})
    body:string

    @JoinColumn()
    @OneToMany(t=>answer,t=>t.proplem)
    answer:answer[]

    @Column({nullable:true})
    ex_img:string

    @Column({default:0,type:"bit"})
    isDelete:string

    @ManyToOne(t=>account,t=>t.id,{nullable:false})
    @JoinColumn()
    author:account

    @UpdateDateColumn()
    updateAt:Date

    @CreateDateColumn()
    createdAt:Date
}