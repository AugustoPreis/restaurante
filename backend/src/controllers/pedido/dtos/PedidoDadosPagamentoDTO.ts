import { PedidoComandaDTO } from './PedidoComandaDTO';

export type PedidoDadosPagamentoDTO = Partial<{
  valor: number;
  valorPago: number;
  comandas: PedidoComandaDTO[];
}>