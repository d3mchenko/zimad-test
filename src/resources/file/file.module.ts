import {Module} from "@nestjs/common";
import {FileController} from "./file.controller";
import {FileService} from "./file.service";
import {FilesModule} from "../../modules/files/files.module";

@Module({
    imports: [FilesModule],
    controllers: [FileController],
    providers: [FileService],
})
export class FileModule {}