import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../entities/user.entity";
import {Repository, UpdateResult} from "typeorm";
import {UserData} from "../../resources/user/dto/user.dto";

@Injectable()
export class UsersRepository {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
    }

    create(userRegistrData: UserData): Promise<UserEntity> {
        return this.userRepository.save(userRegistrData);
    }

    findOne(userData: UserData): Promise<UserEntity> {
        return this.userRepository.findOneBy(userData);
    }

    async updateOne(userData: UserData, updatedUserData: UserData): Promise<void> {
        await this.userRepository.update({ id: userData.id }, updatedUserData);
    }

    async updateOneWithResult(userData: UserData, updatedUserData: UserData): Promise<UpdateResult> {
        return await this.userRepository.update({ id: userData.id }, updatedUserData);
    }
}