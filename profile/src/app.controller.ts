import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

@Controller('profile')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getAll() {
    return this.appService.getAllProfiles();
  }

  @Post('registration')
  async registration(@Body() dto: CreateUserDto) {
    const user = await (await this.appService.registration(dto)).toPromise(); // получаем ответ от микросервиса регистарции
    const profile = await this.appService.createProfile(dto, user); // добавляем профиль
    return profile;
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.appService.getProfileById(id);
  }

  @Put('/:id')
  updateOne(@Param('id') id: number, @Body() dto: CreateProfileDto) {
    return this.appService.updateProfileById(id, dto);
  }

  @Delete('/:id')
  deleteOne(@Param('id') id: number) {
    return this.appService.deleteProfileById(id);
  }
}
