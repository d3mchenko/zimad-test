import {
    Controller, DefaultValuePipe,
    Delete,
    Get,
    Param, ParseIntPipe,
    Post,
    Put,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { Express, Response } from 'express'
import {FileInterceptor} from "@nestjs/platform-express";
import { storage } from './config/storage.config';
import {FileService} from "./file.service";
import {AccessTokenGuard} from "../user/guards/accessToken.guard";

@Controller('file')
export class FileController {
    constructor(private fileService: FileService) {
    }

    @Post('upload')
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(FileInterceptor('file',{ storage }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        await this.fileService.uploadFile(file);
        res.status(201).send('File saved successfully')
    }

    @Get('list')
    @UseGuards(AccessTokenGuard)
    async getListFiles(
        @Query('list_size', new DefaultValuePipe(10), ParseIntPipe) listSize: number = 10,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Res() res: Response
    ) {
        const listFiles = await this.fileService.getListFiles(page, listSize);
        res.send(listFiles);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    async informationFile(@Param('id') fileId: string, @Res() res: Response) {
        const informationFile = await this.fileService.getInformationFile(fileId);
        res.send(informationFile);
    }

    @Get('download/:id')
    @UseGuards(AccessTokenGuard)
    async downloadFile(@Param('id') fileId: string, @Res() res: Response) {
        const pathFile = await this.fileService.getPathFile(fileId);
        res.download(pathFile);
    }

    @Put('update/:id')
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(FileInterceptor('file',{ storage }))
    async updateFile(@Param('id') fileId: string, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        await this.fileService.updateFile(fileId, file);
        res.send('File updated successfully');
    }

    @Delete('delete/:id')
    @UseGuards(AccessTokenGuard)
    async deleteFile(@Param('id') fileId: string, @Res() res: Response) {
        await this.fileService.deleteFile(fileId);
        res.send('File deleted successfully');
    }

}