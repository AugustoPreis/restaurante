import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { produtoService } from '.';
import { ProdutoListagemParametrosDTO } from './dtos/ProdutoListagemParametrosDTO';
import { ProdutoCadastroDTO } from './dtos/ProdutoCadastroDTO';
import { ProdutoAtualizacaoDTO } from './dtos/ProdutoAtualizacaoDTO';
import { ProdutoAtualizarFotoDTO } from './dtos/ProdutoAtualizarFotoDTO';

export class ProdutoController {

  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parametros = req.query as ProdutoListagemParametrosDTO;

      const result = await produtoService.listar(parametros, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      const result = await produtoService.buscarPorId(id, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const produtoCadastroDTO = req.body as ProdutoCadastroDTO;

      const result = await produtoService.cadastrar(produtoCadastroDTO, req.user);

      res.status(HttpStatusCode.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }

  async atualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const produtoAtualizacaoDTO = req.body as ProdutoAtualizacaoDTO;

      produtoAtualizacaoDTO.id = Number(req.params.id);

      const result = await produtoService.atualizar(produtoAtualizacaoDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async atualizarFoto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const produtoAtualizarFotoDTO: ProdutoAtualizarFotoDTO = {};

      produtoAtualizarFotoDTO.id = Number(req.params.id);
      produtoAtualizarFotoDTO.foto = req.file?.buffer;

      const result = await produtoService.atualizarFoto(produtoAtualizarFotoDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async inativar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      const result = await produtoService.inativar(id, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}