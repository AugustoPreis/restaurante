import jwt from 'jsonwebtoken';
import { UsuarioLogadoDTO } from '../controllers/usuario/dtos/UsuarioLogadoDTO';

export function signJWT(values: UsuarioLogadoDTO) {
  const token = jwt.sign({ ...values }, process.env.JWT_TOKEN, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return token;
}