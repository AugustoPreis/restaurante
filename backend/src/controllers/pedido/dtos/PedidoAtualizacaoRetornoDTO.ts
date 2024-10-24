import { PedidoItemAtualizacaoRetornoDTO } from '../../pedidoItem/dtos/PedidoItemAtualizacaoRetornoDTO';

export type PedidoAtualizacaoRetornoDTO = Partial<{
  dataAlteracao: Date;
  itens: PedidoItemAtualizacaoRetornoDTO[];
}>