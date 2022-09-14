import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {FileEntity} from "../../entities/file.entity";
import {FilesRepository} from "./files.repository";

@Module({
    imports: [TypeOrmModule.forFeature([FileEntity])],
    providers: [FilesRepository],
    exports: [FilesRepository],
})
export class FilesModule {}