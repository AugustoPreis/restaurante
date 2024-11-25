import { io } from 'socket.io-client';
import { getToken } from '../providers/AuthProvider';

const { VITE_BACKEND_URL, VITE_BACKEND_PORT } = import.meta.env;

export const socket = io([VITE_BACKEND_URL, VITE_BACKEND_PORT].join(':'), {
  autoConnect: false,
  auth: {
    token: getToken(),
  },
});