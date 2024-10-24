import { NextFunction, Request, Response } from 'express';
import { produtoService } from '../produto';
import { parametrosService } from '../parametros';
import { HttpStatusCode } from '../../enums/HttpStatusCode';

export class ArquivoController {

  async fotoProduto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { uuid } = req.params;
      let foto: Buffer = null;

      foto = await produtoService.buscarFoto(uuid);

      if (!foto) {
        foto = await parametrosService.buscarPorNome('fotoPadraoProduto') as Buffer;
      }

      res.status(HttpStatusCode.OK).send(foto);
    } catch (err) {
      next(err);
    }
  }
}