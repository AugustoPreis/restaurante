import { PedidoItemCadastroDTO } from '../../pedidoItem/dtos/PedidoItemCadastroDTO';

export type PedidoCadastroDTO = Partial<{
  mesaId?: number;
  descricao: string;
  itens: PedidoItemCadastroDTO[];
}>