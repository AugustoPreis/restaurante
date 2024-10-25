import { NextFunction, Request, Response } from 'express';
import { produtoService } from '../produto';
import { parametrosService } from '../parametros';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { arquivoService } from '.';

export class ArquivoController {

  async buscarPorUuid(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tipo, uuid } = req.params;

      const result = await arquivoService.buscarPorUuid(uuid);

      switch (tipo) {
        case 'relatorio':
          res.setHeader('Content-Type', 'application/pdf');
          break;
      }

      res.status(HttpStatusCode.OK).send(result.conteudo);
    } catch (err) {
      next(err);
    }
  }

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