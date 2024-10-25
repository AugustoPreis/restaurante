import { PagamentoListagemDTO } from './PagamentoListagemDTO';

export type PagamentoBuscarResultadoDTO = Partial<{
  pagamentos: PagamentoListagemDTO[];
  valorComanda: number;
  valorPago: number;
  valorRestante: number;
}>