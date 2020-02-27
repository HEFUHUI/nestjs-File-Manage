import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { files } from "./files.entity";

@Entity()
export class label{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @ApiProperty()
    @Column()
    name:string

    @ManyToMany(t=>files,t=>t.labels)
    @JoinColumn()
    file:files[]

    @Column({onUpdate:"CURRENT_TIMESTAMP",default:()=>"CURRENT_TIMESTAMP",name:"update_at",type:'timestamp'})
    updateAt:Date

    @Column("timestamp",{default:()=>"CURRENT_TIMESTAMP",name:"created_at"})
    createdAt:Date
}