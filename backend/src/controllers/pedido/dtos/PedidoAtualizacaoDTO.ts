import { PedidoItemAtualizacaoDTO } from '../../pedidoItem/dtos/PedidoItemAtualizacaoDTO';

export type PedidoAtualizacaoDTO = Partial<{
  id: number;
  mesaId: number;
  descricao: string;
  itens: PedidoItemAtualizacaoDTO[];
}>