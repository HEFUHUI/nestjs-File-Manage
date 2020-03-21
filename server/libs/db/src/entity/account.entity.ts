import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToOne, ManyToMany, JoinTable, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { userinfo } from "./users.entity";
import { image } from "./image.entity";
import { hashSync } from "bcrypt"
import { files } from "./files.entity";
import { answer } from "./answer.entity";
import { problem } from "./problem.entity";
import { notice } from "./notice.entity";

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

    @Column("bit", {
        default: 0, transformer: {
            to: val => val, from: (val: Buffer) => {
                return Boolean(val[0])
            }
        }
    })
    online: number//当前是否在线

    @OneToMany(t => notice, t => t.creater)
    notice: notice[]//对应消息发送者

    @ManyToMany(t => notice, t => t.receive, { cascade: true })
    infomation: notice[]//对应消息接受者

    @Column({ type: "int", default: 0, name: "Grade", comment: "用户等级（0-10）数字越大等级越大" })
    Grade: number

    @Column({ type: "enum", enum: ["enabled", "disabled"], name: 'state', comment: '账户是否禁用状态' })
    state: string

    @ManyToOne(t => image, t => t.id, { nullable: true })
    @JoinColumn({ name: "cover" })
    cover: image//背景，暂时没启用

    @ManyToOne(() => image, t => t.id)
    @JoinColumn()
    avatar: image//用户头像

    @Column({ default: 0, type: "bit" })
    isDelete: number

    @ManyToMany(t => problem, t => t.support, { cascade: true })
    support: problem[]//支持的问题

    @Column({ comment: "爱好", nullable: true })
    like: string

    @Column({ comment: "座右铭", nullable: true })
    motto: string

    @Column({ nullable: true })
    socketid: string

    @ManyToMany(t => answer, t => t.support, { cascade: true })
    supportAnswer: answer[]//支持的回答

    @Column({ default: "无名氏" })
    nickName: string

    @ManyToOne(() => userinfo, t => t.account)
    @JoinColumn()
    info: userinfo

    @ManyToMany(t => files, t => t.collection, { cascade: true })
    collection: files[]//所有的收藏

    @UpdateDateColumn({ transformer: { from: val => new Date(val).toLocaleDateString(), to: val => val } })
    updateAt: Date

    @CreateDateColumn({ transformer: { from: val => new Date(val).toLocaleDateString(), to: val => val } })
    createdAt: Date
}