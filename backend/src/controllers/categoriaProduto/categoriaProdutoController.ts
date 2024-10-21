import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { CategoriaProdutoListagemParametrosDTO } from './dtos/CategoriaProdutoListagemParametrosDTO';
import { categoriaProdutoService } from '.';
import { CategoriaProdutoCadastroDTO } from './dtos/CategoriaProdutoCadastroDTO';
import { CategoriaProdutoAtualizacaoDTO } from './dtos/CategoriaProdutoAtualizacaoDTO';

export class CategoriaProdutoController {

  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parametros = req.query as CategoriaProdutoListagemParametrosDTO;

      const result = await categoriaProdutoService.listar(parametros, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      const result = await categoriaProdutoService.buscarPorId(id, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoriaProdutoCadastroDTO = req.body as CategoriaProdutoCadastroDTO;

      const result = await categoriaProdutoService.cadastrar(categoriaProdutoCadastroDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async atualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoriaProdutoAtualizacaoDTO = req.body as CategoriaProdutoAtualizacaoDTO;

      categoriaProdutoAtualizacaoDTO.id = Number(req.params.id);

      const result = await categoriaProdutoService.atualizar(categoriaProdutoAtualizacaoDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async inativar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      const result = await categoriaProdutoService.inativar(id, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}