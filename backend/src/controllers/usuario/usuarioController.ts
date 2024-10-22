import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { UsuarioLoginDTO } from './dtos/UsuarioLoginDTO';
import { usuarioService } from '.';
import { UsuarioListagemParametrosDTO } from './dtos/UsuarioListagemParametrosDTO';
import { UsuarioCadastroDTO } from './dtos/UsuarioCadastroDTO';
import { UsuarioAtualizacaoDTO } from './dtos/UsuarioAtualizacaoDTO';

export class UsuarioController {

  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioListagemParametrosDTO = req.query as UsuarioListagemParametrosDTO;

      const result = await usuarioService.listar(usuarioListagemParametrosDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      const result = await usuarioService.buscarPorId(id, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioLoginDTO = req.body as UsuarioLoginDTO;

      const result = await usuarioService.login(usuarioLoginDTO);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioCadastroDTO = req.body as UsuarioCadastroDTO;

      const result = await usuarioService.cadastrar(usuarioCadastroDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async atualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioAtualizacaoDTO = req.body as UsuarioAtualizacaoDTO;

      usuarioAtualizacaoDTO.id = Number(req.params.id);

      const result = await usuarioService.atualizar(usuarioAtualizacaoDTO, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async inativar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      const result = await usuarioService.inativar(id, req.user);

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}