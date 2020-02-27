import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import entity from './libs/db/src/entity/entity';

export const ormconfig:TypeOrmModuleOptions={
    type: "mysql",
    name:"default",
    host: "172.16.221.128",
    port: 3306,
    username: "admin",
    password: "Test2017..",
    database: "demo",
    synchronize: true,
    entities:[...entity]
}