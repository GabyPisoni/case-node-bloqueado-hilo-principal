import { Module } from '@nestjs/common';
import { BlockingController } from './blocking.controller';

@Module({
  imports: [],
  controllers: [BlockingController],
  providers: [],
})
export class AppModule {}
