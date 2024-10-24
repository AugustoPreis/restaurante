import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { formaPagamentoService } from '.';
import { FormaPagamentoListagemParametrosDTO } from './dtos/FormaPagamentoListagemParametrosDTO';

export class FormaPagamentoController {

  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const formaPagamentoListagemParametrosDTO = req.query as FormaPagamentoListagemParametrosDTO;

      const result = await formaPagamentoService.listar(formaPagamentoListagemParametrosDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}