export type PedidoItemCadastroDTO = Partial<{
  id: number;
  pedidoId: number;
  produtoId: number;
  comanda: number;
  quantidade: number;
  valor: number;
}>