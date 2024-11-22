export type MovimentoCadastroDTO = Partial<{
  produtoId?: number;
  tipo: string;
  quantidade: number;
  dataMovimento: Date;
  descricao: string;
  pedidoItemId: number;
}>