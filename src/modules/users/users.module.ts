import { Module } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersRepository],
    exports: [UsersRepository],
})
export class UsersModule {}