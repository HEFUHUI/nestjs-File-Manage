import { Controller, Get, Put, UseGuards, Req, Param, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';
import { files } from '@libs/db/entity/files.entity';

@Controller('files')
export class FilesController {
    constructor(private readonly service: FilesService) { }
    @Get()
    async getFile() {
        return {
            files: await this.service.getFiles(),
            labels: await this.service.getLabels()
        };
    }

    @Get("get_item/:id")
    async getFileItem(@Param() p: { id: string }): Promise<files> {
        return await this.service.getFileItem(p.id)
    }

    @Get("get_collection/:id")
    async getCollection(@Param() p: { id: string }): Promise<files[]> {
        return await this.service.getCollection(p.id);
    }

    @Put("collection/:id")
    @UseGuards(AuthGuard("web"))
    async collection(@Req() req: any, @Param() param: any) {
        return await this.service.setCollection(param.id, req.user.id);
    }
}
