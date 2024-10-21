import { MesaListagemDTO } from './MesaListagemDTO';

export type MesaListagemResultadoDTO = Partial<{
  data: MesaListagemDTO[];
  total: number;
}>