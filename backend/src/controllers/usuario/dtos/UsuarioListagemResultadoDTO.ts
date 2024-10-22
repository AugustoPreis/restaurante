import { UsuarioListagemDTO } from './UsuarioListagemDTO';

export type UsuarioListagemResultadoDTO = Partial<{
  data: UsuarioListagemDTO[];
  total: number;
}>