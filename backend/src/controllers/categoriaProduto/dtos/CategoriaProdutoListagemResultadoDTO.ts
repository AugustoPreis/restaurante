import { CategoriaProdutoListagemDTO } from './CategoriaProdutoListagemDTO';

export type CategoriaProdutoListagemResultadoDTO = Partial<{
  data: CategoriaProdutoListagemDTO[];
  total: number;
}>