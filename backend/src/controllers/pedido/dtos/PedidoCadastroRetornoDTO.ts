import { PedidoItemCadastroRetornoDTO } from '../../pedidoItem/dtos/PedidoItemCadastroRetornoDTO';

export type PedidoCadastroRetornoDTO = Partial<{
  id: number;
  numero: number;
  dataCadastro: Date;
  itens: PedidoItemCadastroRetornoDTO[];
}>