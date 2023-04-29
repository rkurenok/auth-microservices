import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Users } from './users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    // ServeStaticModule.forRoot({ // для раздачи статики с сервера
    //     rootPath: path.resolve(__dirname, 'static'),
    // }),
    SequelizeModule.forRoot({ // конфигурация бд
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT), // порт должен быть числовым значением
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Users], // модели данных (таблицы)
      autoLoadModels: true // создание таблиц на основании моделей
    }),
    SequelizeModule.forFeature([Users]), // импортируем все модели, которые используем внутри модуля
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [
    AppService
  ]
})
export class AppModule { }
