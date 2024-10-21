import { UsuarioLogadoDTO } from '../controllers/usuario/dtos/UsuarioLogadoDTO';
import { DefaultParams } from '../types/DefaultParams';
import { isValidPagination, isValidString } from './validators';

export function defaultParams<T>(params: T, usuarioLogado: UsuarioLogadoDTO): T & DefaultParams {
  const { crescente, filtro, itensPagina, ordem, paginaAtual } = params as DefaultParams;
  const defaultParams: DefaultParams = {
    filtro: '',
    paginaAtual: 1,
    itensPagina: 5,
    idEmpresa: usuarioLogado?.empresa?.id,
    crescente: crescente?.toString?.() === 'true',
  };

  if (isValidString(filtro)) {
    defaultParams.filtro = filtro.trim();
  }

  if (isValidPagination(paginaAtual, itensPagina)) {
    defaultParams.paginaAtual = Number(paginaAtual);
    defaultParams.itensPagina = Number(itensPagina);
  }

  if (isValidString(ordem)) {
    defaultParams.ordem = ordem.trim();
  }

  return { ...params, ...defaultParams };
}