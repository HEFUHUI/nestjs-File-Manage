import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { files } from "./files.entity";

@Entity()
export class label{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @ApiProperty()
    @Column()
    name:string

    @Column({default:0,type:"bit"})
    isDelete:number

    @ManyToMany(t=>files,t=>t.label,{cascade:true})
    file:files[]

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