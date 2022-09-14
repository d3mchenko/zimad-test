import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Tokens} from "./dto/tokens.dto";
import { JwtService } from "@nestjs/jwt";
import {UsersRepository} from "../../modules/users/users.repository";
import * as bcrypt from 'bcrypt';
import {UserEntity} from "../../entities/user.entity";

@Injectable()
export class TokensService {
    constructor(private jwtService: JwtService, private readonly usersRepository: UsersRepository) {
    }

    async generateTokens(userId: string): Promise<Tokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ userId }, { expiresIn: '10m', secret: process.env.ACCESS_TOKEN }),
            this.jwtService.signAsync({ userId }, { expiresIn: '30d', secret: process.env.REFRESH_TOKEN }),
        ])

        return { accessToken, refreshToken };
    }

    async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersRepository.updateOne({ id: userId }, { refreshToken: hashedRefreshToken })
    }

    async compareRefrTokens(userId: string, refreshToken: string): Promise<void> {
        const user = await this.usersRepository.findOne({ id: userId });
        if (!(await UserEntity.compareRefrTokens(refreshToken, user.refreshToken))) {
            throw new HttpException('Refresh token error', HttpStatus.FORBIDDEN)
        }
    }
}