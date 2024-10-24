import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { PedidoCadastroDTO } from './dtos/PedidoCadastroDTO';
import { pedidoService } from '.';
import { PedidoListagemParametrosDTO } from './dtos/PedidoListagemParametrosDTO';
import { PedidoAtualizacaoDTO } from './dtos/PedidoAtualizacaoDTO';

export class PedidoController {

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const pedidoListagemParametrosDTO = req.query as PedidoListagemParametrosDTO;

      const result = await pedidoService.listar(pedidoListagemParametrosDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const pedidoId = Number(req.params.id);

      const result = await pedidoService.buscarPorId(pedidoId, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async cadastrar(req: Request, res: Response, next: NextFunction) {
    try {
      const pedidoCadastroDTO = req.body as PedidoCadastroDTO;

      const result = await pedidoService.cadastrar(pedidoCadastroDTO, req.user);

      res.status(HttpStatusCode.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const pedidoAtualizacaoDTO = req.body as PedidoAtualizacaoDTO;

      pedidoAtualizacaoDTO.id = Number(req.params.id);

      const result = await pedidoService.atualizar(pedidoAtualizacaoDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async inativar(req: Request, res: Response, next: NextFunction) {
    try {
      const pedidoId = Number(req.params.id);

      const result = await pedidoService.inativar(pedidoId, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}