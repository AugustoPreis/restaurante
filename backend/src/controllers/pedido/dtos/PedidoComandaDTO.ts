import { PedidoItemConsultaDTO } from '../../pedidoItem/dtos/PedidoItemConsultaDTO';

export type PedidoComandaDTO = Partial<{
  numero: number;
  valor: number;
  valorPago: number;
  itens: PedidoItemConsultaDTO[];
}>