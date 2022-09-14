import {UsersRepository} from "../../modules/users/users.repository";
import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {UserData} from "./dto/user.dto";
import {UserEntity} from "../../entities/user.entity";


@Injectable()
export class UserService {
    constructor(private readonly userRepository: UsersRepository) {
    }

    async registerUser(userRegistrData: UserData): Promise<UserEntity> {
        const existingUser = await this.userRepository.findOne({ id: userRegistrData.id });

        if (existingUser) {
            throw new HttpException('This user already exists.', HttpStatus.BAD_REQUEST);
        }

        const newUser = new UserEntity();
        newUser.password = userRegistrData.password;
        newUser.id = userRegistrData.id;

        return await this.userRepository.create(newUser);
    }

    async loginUser(userLoginData: UserData): Promise<UserEntity> {
        const existingUser = await this.userRepository.findOne({ id: userLoginData.id });

        if (!existingUser || !(await UserEntity.comparePasswords(userLoginData.password, existingUser.password))) {
            throw new HttpException('The entered data is not correct', HttpStatus.BAD_REQUEST);
        }
        return existingUser;
    }

    async logoutUser(userId: string): Promise<void> {
        const updatedResult = await this.userRepository.updateOneWithResult({ id: userId }, { refreshToken: null })
        if (!updatedResult.affected || updatedResult.affected === 0) {
            throw new HttpException('A logout error occurred', HttpStatus.BAD_REQUEST);
        }
    }
}