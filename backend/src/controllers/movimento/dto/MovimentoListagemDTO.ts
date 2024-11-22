export type MovimentoListagemDTO = Partial<{
  id: number;
  tipo: string;
  quantidade: number;
  estoque: number;
  descricao: string;
  dataMovimento: Date;
  dataCadastro: Date;
}>