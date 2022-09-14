import { Module } from "@nestjs/common";
import { UserController } from "./user.controller.js";
import { UsersModule } from "../../modules/users/users.module";
import { UserService } from "./user.service";
import { TokensModule } from "../tokens/tokens.module";

@Module({
    imports: [UsersModule, TokensModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}