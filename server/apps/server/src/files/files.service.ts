import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { files } from '@libs/db/entity/files.entity';
import { account } from '@libs/db/entity/account.entity';
import { label } from '@libs/db/entity/label.entity';

@Injectable()
export class FilesService {
    
    constructor(@InjectConnection() private readonly connection:Connection){}
    async getFiles():Promise<files[]>{
        return await this.connection.manager.find(files,{relations:["desc_image","label","author","collection"]})
    }
    async setCollection(file_id:string,user_id:string){
        try {
            const file = await this.connection.manager.findOne(files,file_id,{relations:["collection"]});
            file.collection.push(await this.connection.manager.findOne(account,user_id));
            await this.connection.manager.save(file);
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async getLabels():Promise<label[]>{
        return await this.connection.manager.find(label,{relations:["file"]})
    }
}
