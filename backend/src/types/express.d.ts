import { UsuarioLogadoDTO } from '../controllers/usuario/dtos/UsuarioLogadoDTO';

declare global {
  namespace Express {
    export interface Request {
      user?: UsuarioLogadoDTO;
    }
  }
}