import socket, { Server, Socket } from 'socket.io';
import http from 'http';
import webSocketAuth from './Midllewares/WebSocketAuth';

let io: Server;

export default function setupWebSocket(server: http.Server) {
  io = new Server(server, { cors: {} });
  io.use(webSocketAuth)
  io.on("connection", (socket: Socket) => {
    const query = socket.handshake.query as any;
    socket.join(query.oficina)
  });
}

export function sendMessageTo(room: string, message: string, data: any) {
  io.to(room).emit(message, data);
}

