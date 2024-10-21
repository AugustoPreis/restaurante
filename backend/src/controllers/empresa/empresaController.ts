import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { empresaService } from '.';
import { EmpresaAtualizacaoDTO } from './dtos/EmpresaAtualizacaoDTO';

export class EmpresaController {

  async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      const result = await empresaService.buscarPorId(id, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async atualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const empresaAtualizacaoDTO = req.body as EmpresaAtualizacaoDTO;

      empresaAtualizacaoDTO.id = Number(req.params.id);

      const result = await empresaService.atualizar(empresaAtualizacaoDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}