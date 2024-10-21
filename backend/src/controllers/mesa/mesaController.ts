import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { MesaListagemParametrosDTO } from './dtos/MesaListagemParametrosDTO';
import { mesaService } from '.';
import { MesaCadastroDTO } from './dtos/MesaCadastroDTO';
import { MesaAtualizacaoDTO } from './dtos/MesaAtualizacaoDTO';

export class MesaController {

  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parametros = req.query as MesaListagemParametrosDTO;

      const result = await mesaService.listar(parametros, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      const result = await mesaService.buscarPorId(id, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mesaCadastroDTO = req.body as MesaCadastroDTO;

      const result = await mesaService.cadastrar(mesaCadastroDTO, req.user);

      res.status(HttpStatusCode.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }

  async atualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mesaAtualizacaoDTO = req.body as MesaAtualizacaoDTO;

      mesaAtualizacaoDTO.id = Number(req.params.id);

      const result = await mesaService.atualizar(mesaAtualizacaoDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async inativar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      const result = await mesaService.inativar(id, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}