import { Controller, Get } from '@nestjs/common';
import { AppService } from '@/app.service';

/** Handles the backend's root HTTP route. */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** Returns the root-route health message. */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
