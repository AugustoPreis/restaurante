import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { UsuarioLogadoDTO } from '../controllers/usuario/dtos/UsuarioLogadoDTO';

export function verifyJWT(req: Request, res: Response, callback: () => void) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ auth: false, message: 'Sem autentificação.' });
  }

  jwt.verify(token, process.env.JWT_TOKEN, async (err, decoded: UsuarioLogadoDTO) => {
    if (err) {
      let message = 'Falha na autentificação';

      if (err.message === 'jwt expired') {
        message = 'Login expirado.';
      }

      return res.status(HttpStatusCode.UNAUTHORIZED).json({ auth: false, message });
    }

    req.user = decoded;

    callback();
  });
}