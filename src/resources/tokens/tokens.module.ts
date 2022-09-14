import { Module } from "@nestjs/common";
import { TokensService } from "./tokens.service";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy, RefreshTokenStrategy } from "../user/strategies/strategies";
import { UsersModule } from "../../modules/users/users.module";

@Module({
    imports: [JwtModule.register({}), UsersModule],
    providers: [TokensService, AccessTokenStrategy, RefreshTokenStrategy],
    exports: [TokensService]
})
export class TokensModule {}