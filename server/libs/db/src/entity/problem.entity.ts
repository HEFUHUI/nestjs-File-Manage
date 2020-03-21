import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
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

    @ManyToMany(t=>account,t=>t.support)
    @JoinTable({
        name:"support_problem",
        joinColumns:[
            {name:"problem"}
        ],
        inverseJoinColumns:[
            {name:'support'}
        ]
    })
    support:account[]

    @Column({nullable:true,type:"text"})
    ex_img:string

    @Column({default:0,type:"bit"})
    isDelete:number

    @Column("varchar",{nullable:false,default:'计算机'})
    topic:string

    @ManyToOne(t=>account,t=>t.id,{nullable:false})
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