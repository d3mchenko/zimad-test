import {Body, Controller, Get, Post, Res, UseGuards} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserData } from "./dto/user.dto";
import { TokensService } from "../tokens/tokens.service";
import { Response } from 'express';
import {AccessTokenGuard} from "./guards/accessToken.guard";
import {UserDecorator} from "./decorators/decorators";
import {RefreshTokenGuard} from "./guards/refreshToken.guard";

@Controller('user')
export class UserController {
    constructor(private userService: UserService, private tokensService: TokensService) {
    }

    @Post('signup')
    async registerUser(@Res() res: Response, @Body() userRegistrData: UserData) {
        const newUser = await this.userService.registerUser(userRegistrData);

        const tokens = await this.tokensService.generateTokens(newUser.id);
        await this.tokensService.saveRefreshToken(newUser.id, tokens.refreshToken);

        res.cookie(
            'refreshToken',
            tokens.refreshToken,
            { httpOnly: true, maxAge: 60 * 60 * 24 * 30 * 1000 }
        );

        res.send({ accessToken: tokens.accessToken })
    }

    @Post('signin')
    async loginUser(@Body() userLoginData: UserData, @Res() res: Response) {
        const user = await this.userService.loginUser(userLoginData);

        const tokens = await this.tokensService.generateTokens(user.id);
        await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken);

        res.cookie(
            'refreshToken',
            tokens.refreshToken,
            { httpOnly: true, maxAge: 60 * 60 * 24 * 30 * 1000 }
        );

        res.send({ accessToken: tokens.accessToken })
    }

    // TODO: `
    //  По условию задачи надо было продлевать AccessToken по RefreshToken. Не понял как это можно сделать без фронта.
    //  Схема обновления токена: Если AccessToken истекает, возвращается на фронт Expiration Error, делается запрос на endpoint
    //  new_token и делается релоуд запроса, на котором упала ошибка(с помощью axios instance).`
    @Post('new_token')
    @UseGuards(RefreshTokenGuard)
    async refreshTokens(
        @UserDecorator('refreshToken') refreshToken: string,
        @UserDecorator('userId') userId: string,
        @Res() res: Response
    ) {
        await this.tokensService.compareRefrTokens(userId, refreshToken);

        const tokens = await this.tokensService.generateTokens(userId);
        await this.tokensService.saveRefreshToken(userId, tokens.refreshToken);

        res.cookie(
            'refreshToken',
            tokens.refreshToken,
            { httpOnly: true, maxAge: 60 * 60 * 24 * 30 * 1000 }
        );

        res.send({ accessToken: tokens.accessToken })
    }

    // TODO: `Не понял зачем при logout возвращать новый токен(по условию тех.задания)`
    @Get('logout')
    @UseGuards(AccessTokenGuard)
    async logout(@UserDecorator('userId') userId: string, @Res() res: Response) {
        await this.userService.logoutUser(userId);
        res.clearCookie('refreshToken').status(200).send('You have successfully logged out');
    }

    @Get('info')
    @UseGuards(AccessTokenGuard)
    async getUserData(@UserDecorator('userId') userId: string, @Res() res: Response) {
        res.send(userId);
    }
}