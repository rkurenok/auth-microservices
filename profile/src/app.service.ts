import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profile.model';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class AppService {
  constructor(@Inject('AUTH_MICROSERVICE') private client: ClientProxy, @InjectModel(Profile) private profileRepository: typeof Profile) { }

  onModuleInit() {
    //Reply topic to get msg abck from Kafka msg consumer.
   // //In message send Kafka uses two topics one for request and the other for response topic ending with *.reply
   this.client.connect();
 }

  async getAllProfiles() {
    const profiles = await this.profileRepository.findAll(); // получаем все профили
    return profiles;
  }

  async registration(dto: CreateUserDto): Promise<any> {
    const { email, password } = { ...dto };
    const message = { email: email, password: password };
    // конфигурируем сообщение
    const record = new RmqRecordBuilder(message)
      .setOptions({
        headers: {
          ['x-version']: '1.0.0',
        },
        priority: 3,
        contentType: "application/json",
      })
      .build();

    return this.client.send('registration', record); // отправляем сообщение с паттерном registration и подписываемся на ответ
  }

  async createProfile(dto: CreateUserDto, user) {
    const profile = await this.profileRepository.create({ ...dto, userId: user.id });

    return { user, profile };
  }

  async getProfileById(id: number) {
    const profile = await this.profileRepository.findOne({ where: { id } });
    return profile;
  }

  async updateProfileById(id: number, dto: CreateProfileDto) {
    const profile = await this.profileRepository.findByPk(id);
    if (!profile) {
      throw new HttpException('Профиль не найден', HttpStatus.NOT_FOUND);
    }
    await profile.update({ ...dto });
    return profile;
  }

  async deleteProfileById(id: number) {
    const profile = await this.profileRepository.findByPk(id);
    if (!profile) {
      throw new HttpException('Профиль не найден', HttpStatus.NOT_FOUND);
    }
    await this.profileRepository.destroy({ where: { id } });

    return "Профиль был успешно удален";
  }
}
