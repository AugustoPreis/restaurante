import { MovimentoResultadoDTO } from '../../movimento/dto/MovimentoResultadoDTO';

export type PedidoItemCadastroRetornoDTO = Partial<{
  id: number;
  dataCadastro: Date;
  movimentoEstoque: MovimentoResultadoDTO;
}>