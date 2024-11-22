export type ProdutoCadastroDTO = Partial<{
  codigo: string;
  nome: string;
  descricao: string;
  valor: number;
  movimentaEstoque: boolean;
  categoriaId: number;
}>