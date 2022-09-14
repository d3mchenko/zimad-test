import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import databaseConfig from './config/database';
import { UserModule } from "./resources/user/user.module";
import {FileModule} from "./resources/file/file.module";

@Module({
  imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRoot(databaseConfig.getTypeOrmConfig()),
      UserModule,
      FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
