import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { userinfo } from "./users.entity";
import { image } from "./image.entity";
import { hashSync, compareSync } from "bcrypt"
import { files } from "./files.entity";
import { answer } from "./answer.entity";

@Entity()
export class account {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    email: string

    @Column({
        transformer: {
            from: (val) => val, to: (val) => {
                if (val.length >= 60) {
                    return val;
                } else {
                    return hashSync(val, 10)
                }
            }
        }
    })
    password: string

    @Column({ type: "int", default: 0, name: "Grade", comment: "用户等级（0-10）数字越大等级越大" })
    Grade: number

    @Column({type:"enum",enum:["enabled","disabled"],name:'state',comment:'账户是否禁用状态'})
    state:string

    @ManyToOne(t => image, t => t.id, { nullable: true })
    @JoinColumn({ name: "cover" })
    cover: image

    @ManyToOne(() => image, t => t.id)
    @JoinColumn()
    avatar: image

    @Column({default:0,type:"bit"})
    isDelete:string

    @Column({ comment: "爱好", nullable: true })
    like: string

    @Column({ comment: "座右铭", nullable: true })
    motto: string

    @Column({ nullable: true })
    socketid: string

    @ManyToMany(t=>answer,t=>t.support,{cascade:true})
    supportAnswer:answer[]


    @Column({ default: "无名氏" })
    nickName: string

    @ManyToOne(() => userinfo, t => t.account)
    @JoinColumn()
    info: userinfo

    @ManyToMany(t=>files,t=>t.collection,{cascade:true})
    collection:files[]

    @Column({ onUpdate: "CURRENT_TIMESTAMP", default: () => "CURRENT_TIMESTAMP", name: "update_at", type: 'timestamp' })
    updateAt: Date

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP", name: "created_at" })
    createdAt: Date
}