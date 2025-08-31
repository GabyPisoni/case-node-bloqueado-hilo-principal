import { Module } from '@nestjs/common';
import { BlockingController } from './blocking.controller';
import { WorkerService } from './utils/thread-worker';
import { IWorkerService } from './utils/IWorkerServie';

@Module({
  controllers: [BlockingController],
  providers: [
    WorkerService,
    {
      provide: IWorkerService,
      useClass: WorkerService,
    },
  ],
})
export class AppModule {}
