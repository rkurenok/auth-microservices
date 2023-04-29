import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('registration')
  registration(@Payload() data, @Ctx() context: RmqContext) {
    console.log(data);
    return this.appService.registration(data);
  }
}
