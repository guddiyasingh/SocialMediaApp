import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { NotificationGateway } from './realtime/notification.gateway';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]), // 10 req/min default
    QueueModule,
    AuthModule,
    UserModule,
    PostModule,
  ],
  providers: [NotificationGateway],
})
export class AppModule {}
