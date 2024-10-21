import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { UsuarioLoginDTO } from './dtos/UsuarioLoginDTO';
import { usuarioService } from '.';

export class UsuarioController {

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioLoginDTO = req.body as UsuarioLoginDTO;

      const result = await usuarioService.login(usuarioLoginDTO);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}