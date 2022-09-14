import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Express} from "express";
import * as path from "path";
import {FileEntity} from "../../entities/file.entity";
import {FilesRepository} from "../../modules/files/files.repository";
import * as fs from "fs";
import {FileData} from "./dto/file.dto";

@Injectable()
export class FileService {
    public pathFiles: string = path.join(__dirname, '../../..', 'src/files');

    constructor(private readonly filesRepository: FilesRepository) {
    }

    async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
        const instanceFile = await this.createInstanceFile(file);

        return await this.filesRepository.create(instanceFile);
    }

    async updateFile(fileIdForUpdate: string, file: Express.Multer.File): Promise<void> {
        const instanceFile = await this.createInstanceFile(file);
        const currentFileData = await this.filesRepository.findOne({ id: Number(fileIdForUpdate) });

        if (!currentFileData) {
            throw new HttpException(`The file does not exist`, HttpStatus.BAD_REQUEST);
        }

        await this.deleteFileInFolder(currentFileData.fileNameInSystem);

        await this.filesRepository.updateOne({ id: Number(fileIdForUpdate) }, instanceFile);
    }

    async createInstanceFile(file: Express.Multer.File): Promise<FileEntity> {
        let extensionFile = path.extname(file.originalname);
        const fileName = path.basename(file.originalname, extensionFile);

        if (!extensionFile) {
            extensionFile = null;
        }

        const newFile = new FileEntity();
        newFile.fileNameInSystem = file.filename;
        newFile.name = fileName;
        newFile.extension = extensionFile;
        newFile.size = file.size;
        newFile.mimeType = file.mimetype;

        return newFile;
    }

    async getPathFile(fileId: string): Promise<string> {
        const currentFileData = await this.filesRepository.findOne({ id: Number(fileId) });

        if (!currentFileData) {
            throw new HttpException(`The file does not exist`, HttpStatus.BAD_REQUEST);
        }

        return path.join(this.pathFiles, `${currentFileData.fileNameInSystem}`);
    }

    async getInformationFile(fileId: string): Promise<FileData> {
        const currentFileData = await this.filesRepository.findOne({ id: Number(fileId) });

        if (!currentFileData) {
            throw new HttpException(`The file does not exist`, HttpStatus.BAD_REQUEST);
        }

        return {
            id: currentFileData.id,
            name: currentFileData.name,
            size: currentFileData.size,
            uploadDate: currentFileData.uploadDate,
            mimeType: currentFileData.mimeType,
            extension: currentFileData.extension,
        };
    }

    async deleteFile(fileId: string): Promise<void> {
        const currentFileData = await this.filesRepository.findOne({ id: Number(fileId) });

        if (!currentFileData) {
            throw new HttpException(`The file does not exist`, HttpStatus.BAD_REQUEST);
        }

        await this.deleteFileInFolder(currentFileData.fileNameInSystem);

        await this.filesRepository.deleteOne({ id: currentFileData.id })
    }

    async deleteFileInFolder(fileNameInSystem: string): Promise<void> {
        fs.unlink(path.join(this.pathFiles, `${fileNameInSystem}`), (err) => {
            if (err) console.log(err);
        });
    }

    async getListFiles(page: number, listSize: number): Promise<FileData[]> {
        if (page === 0) {
            throw new HttpException(`The request failed. Pls, check parameters`, HttpStatus.BAD_REQUEST)
        }

        const fileListData = await this.filesRepository.paginate(page, listSize);

        return fileListData.map(fileData => {
            return {
                id: fileData.id,
                name: fileData.name,
                size: fileData.size,
                uploadDate: fileData.uploadDate,
                mimeType: fileData.mimeType,
                extension: fileData.extension
            }
        });
    }
}