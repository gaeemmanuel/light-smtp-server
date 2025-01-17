import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { environment } from '../environments/environment';
import { SocketEvent } from '../types';
import { createMailServer } from './mail';

const httpServer = createServer();

const io = new Server(httpServer, {});

const mailServer = createMailServer(io);

io.on(SocketEvent.connection, (socket: Socket) => {
  console.debug('New client connected', socket.id);

  // Send all current mails to new client
  socket.emit(SocketEvent.mail_init, mailServer.getMails());

  socket.on(SocketEvent.disconnect, () => {
    console.debug('Client disconnected', socket.id);
  });
});

httpServer.listen(environment.socket.port, () => {
  console.log(`Socket Server listening on port ${environment.socket.port}`);
});

mailServer.listen(environment.smtp);
