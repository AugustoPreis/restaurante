import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';

import { logger } from '../utils/logger';
import { isValidString } from '../utils/validators';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SocketData = any;

export function initSocket(server: HttpServer): SocketServer {
  const io = new SocketServer(server, {
    cors: {
      origin: '*',
    },
  });

  io.use((socket, next) => {
    try {
      const { token } = socket.handshake.auth;

      if (!isValidString(token)) {
        throw new Error('Token JWT inválido');
      }

      socket.handshake.auth.user = jwt.verify(token, process.env.JWT_TOKEN);

      return next();
    } catch (err) {
      logger.message(`Erro ao autenticar socket: ${err?.message || err}`, 'error');

      return next(err);
    }
  });

  io.on('connection', (socket) => {
    const { user } = socket.handshake.auth;

    logger.message(`Usuário "${user.nome}" conectado, ID Nº ${user.id}`, 'info');

    socket.on('disconnect', () => {
      logger.message(`Usuário "${user.nome}" desconectado, ID Nº ${user.id}`, 'info');
    });
  });

  return io;
}

export function emitEvent(socket: SocketServer, event: string, data?: SocketData) {
  try {
    socket.emit(event, data);
  } catch (err) {
    logger.message(`Erro ao emitir evento: ${err?.message || err}`, 'error');
  }
}

export function listenEvent(socket: SocketServer, event: string, callback: (data: SocketData) => void) {
  socket.on(event, (data) => {
    try {
      callback(data);
    } catch (err) {
      logger.message(`Erro ao receber evento: ${err?.message || err}`, 'error');
    }
  });
}