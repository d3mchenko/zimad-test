import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export class DatabaseConfig {

    private getValue(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Error in database config - missing ${key}`);
        }
        return value;
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.getValue('MYSQL_HOST'),
            port: parseInt(this.getValue('MYSQL_PORT')),
            username: this.getValue('MYSQL_USER'),
            password: this.getValue('MYSQL_PASSWORD'),
            database: this.getValue('MYSQL_DATABASE'),
            entities: ['dist/**/*.entity.js'],
            synchronize: true,
        };
    }
}

export default new DatabaseConfig();