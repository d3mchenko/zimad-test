import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {FileEntity} from "../../entities/file.entity";
import {FileData} from "../../resources/file/dto/file.dto";

@Injectable()
export class FilesRepository {
    constructor(@InjectRepository(FileEntity) private fileRepository: Repository<FileEntity>) {
    }

    create(fileData: FileData): Promise<FileEntity> {
        return this.fileRepository.save(fileData);
    }

    findOne(fileData: FileData): Promise<FileEntity> {
        return this.fileRepository.findOneBy(fileData);
    }

    async updateOne(fileData: FileData, updatedFileData: FileData): Promise<void> {
        await this.fileRepository.update({ id: fileData.id }, updatedFileData);
    }

    async deleteOne(fileData: FileData): Promise<void> {
        await this.fileRepository.delete({ id: fileData.id });
    }

    async paginate(page: number, listSize: number): Promise<FileEntity[]> {
        return await this.fileRepository
            .createQueryBuilder()
            .limit(listSize)
            .offset((page-1) * listSize)
            .getMany();
    }
}