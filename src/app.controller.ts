import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { config } from 'dotenv';
// 读取 .env 文件
const envConfig = config();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/t')
  getHelloo(): string {
    return envConfig.parsed.DB_HOST || process.env.DB_HOST || 'tttt';
  }
}
