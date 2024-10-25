import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { RelatorioListagemParametrosDTO } from './dtos/RelatorioListagemParametrosDTO';
import { relatorioService } from '.';
import { RelatorioImpressaoFiltroDTO } from './dtos/RelatorioImpressaoFiltroDTO';

export class RelatorioController {

  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const relatorioListagemParametrosDTO = req.query as RelatorioListagemParametrosDTO;

      const result = await relatorioService.listar(relatorioListagemParametrosDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async imprimirPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const relatorioImpressaoFiltroDTO = req.query as RelatorioImpressaoFiltroDTO;

      relatorioImpressaoFiltroDTO.relatorioId = Number(req.params.id);

      const result = await relatorioService.imprimir(relatorioImpressaoFiltroDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}