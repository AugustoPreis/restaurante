import { MovimentoResultadoDTO } from '../../movimento/dto/MovimentoResultadoDTO';

export type PedidoItemAtualizacaoRetornoDTO = Partial<{
  id: number;
  dataAlteracao: Date;
  ativo: boolean;
  movimentoEstoque: MovimentoResultadoDTO;
}>