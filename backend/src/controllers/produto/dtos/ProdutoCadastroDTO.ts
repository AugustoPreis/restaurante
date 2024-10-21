export type ProdutoCadastroDTO = Partial<{
  codigo: string;
  nome: string;
  descricao: string;
  valor: number;
  categoriaId: number;
}>