import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({ cors: { origin: process.env.CORS_ORIGIN, credentials: true } })
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private userSockets = new Map<string, Set<string>>(); // userId -> socketIds

  handleConnection(client: Socket) {
    // Expect access token in query or header
    const token = client.handshake.auth?.token || client.handshake.headers['authorization']?.toString().replace('Bearer ','');
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const userId = payload.sub as string;
      const set = this.userSockets.get(userId) ?? new Set();
      set.add(client.id);
      this.userSockets.set(userId, set);
      client.on('disconnect', () => {
        const s = this.userSockets.get(userId);
        if (s) { s.delete(client.id); if (!s.size) this.userSockets.delete(userId); }
      });
    } catch {
      client.disconnect(true);
    }
  }

  pushToUser(userId: string, data: any) {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;
    for (const sid of sockets) this.server.to(sid).emit('notification', data);
  }
}
