import {BeforeInsert, Column, Entity, PrimaryColumn} from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    refreshToken: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    static async compareRefrTokens(refreshToken: string, hashedRefreshToken: string): Promise<boolean> {
        return await bcrypt.compare(refreshToken, hashedRefreshToken);
    }
}