import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SignalingGateway {
  private rooms = new Map<string, Set<string>>();

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
  }

  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    socket.to(data.roomId).emit('offer', data.offer);
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    socket.to(data.roomId).emit('answer', data.answer);
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(data.roomId).emit('ice-candidate', data.candidate);
  }

  @SubscribeMessage('end-call')
  handleEndCall(@MessageBody() roomId: string, @ConnectedSocket() socket: Socket) {
    socket.to(roomId).emit('call-ended');
    socket.leave(roomId);
  }
}
