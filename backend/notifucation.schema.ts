import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type NotificationDoc = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  to: Types.ObjectId;
  @Prop({ required: true })
  type: 'NEW_POST';
  @Prop()
  message: string;
  @Prop({ type: Types.ObjectId, ref: 'Post' })
  postId?: Types.ObjectId;
  @Prop({ default: false })
  read: boolean;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
