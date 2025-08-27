import { Module } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { FanoutProcessor } from './workers/fanout.processor';

@Module({
  providers: [
    {
      provide: 'NOTIF_QUEUE',
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) =>
        new Queue('notifications', { connection: { url: cfg.get('REDIS_URL') } }),
    },
    FanoutProcessor,
  ],
  exports: ['NOTIF_QUEUE'],
})
export class QueueModule {}
