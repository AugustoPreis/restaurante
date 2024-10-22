export type ProdutoAtualizacaoDTO = Partial<{
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  categoriaId: number;
}>