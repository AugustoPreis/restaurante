export type PedidoItemAtualizacaoDTO = Partial<{
  id: number;
  pedidoId: number;
  comanda: number;
  produtoId: number;
  quantidade: number;
  valor: number;
}>