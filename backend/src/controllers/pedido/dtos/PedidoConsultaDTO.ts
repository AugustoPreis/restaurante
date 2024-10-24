import { MesaListagemDTO } from '../../mesa/dtos/MesaListagemDTO';
import { PedidoItemConsultaDTO } from '../../pedidoItem/dtos/PedidoItemConsultaDTO';

export type PedidoConsultaDTO = Partial<{
  mesa: MesaListagemDTO;
  descricao: string;
  itens: PedidoItemConsultaDTO[];
}>