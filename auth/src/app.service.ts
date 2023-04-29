import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { Users } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AppService {
  constructor(@InjectModel(Users) private usersRepository: typeof Users) {}

  async registration(userDto: CreateUserDto) {
    const candidate = await this.getUsersByEmail(userDto.email); // проверяем емэил пользователя
    if (candidate) { // если email уже занят
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST); // 400 status
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5); // хешируем пароль + соль
    const user = await this.usersRepository.create({ ...userDto, password: hashPassword }); // добавляем пользователя
    console.log(user.dataValues);

    return user;
  }

  // функция для проверки мэила во время регистрации/логина
  async getUsersByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email }, include: { all: true } });
    return user;
  }
}
