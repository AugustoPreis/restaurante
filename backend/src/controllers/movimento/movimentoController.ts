import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { movimentoService } from '.';
import { MovimentoListagemParametrosDTO } from './dto/MovimentoListagemParametrosDTO';

export class MovimentoController {

  async listarPorProduto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parametros = req.query as MovimentoListagemParametrosDTO;

      parametros.produtoId = Number(req.params.produtoId);

      const result = await movimentoService.listarPorProduto(parametros, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}