import { Injectable } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDoc } from '../../user/user.schema';
import { Notification } from '../../notification/notification.schema';
import { NotificationGateway } from '../../realtime/notification.gateway';

@Injectable()
export class FanoutProcessor {
  constructor(
    private cfg: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDoc>,
    @InjectModel(Notification.name) private notifModel: Model<any>,
    private gateway: NotificationGateway,
  ) {
    new Worker(
      'notifications',
      async (job: Job) => this.handle(job),
      { connection: { url: this.cfg.get('REDIS_URL') } },
    );
  }

  async handle(job: Job) {
    const { authorId, postId } = job.data as { authorId: string; postId: string };
    const author = await this.userModel.findById(authorId).lean();
    const followers = author?.followers ?? [];

    for (const f of followers) {
      const n = await this.notifModel.create({
        to: new Types.ObjectId(f),
        type: 'NEW_POST',
        message: `${author.name || 'Someone'} posted`,
        postId,
      });
      // push realtime to connected client
      this.gateway.pushToUser(f.toString(), { type: 'NEW_POST', postId, id: n._id, message: n.message });
    }
  }
}
