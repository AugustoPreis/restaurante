import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { pagamentoService } from '.';
import { PagamentoCadastroDTO } from './dtos/PagamentoCadastroDTO';

export class PagamentoController {

  async buscarPorComandaPedido(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pedidoId = Number(req.params.pedidoId);
      const comanda = Number(req.params.comanda);

      const result = await pagamentoService.buscarPorComandaPedido({ pedidoId, comanda }, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagamentoCadastroDTO = req.body as PagamentoCadastroDTO;

      const result = await pagamentoService.cadastrar(pagamentoCadastroDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async inativar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagamentoId = Number(req.params.id);

      const result = await pagamentoService.inativar(pagamentoId, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}