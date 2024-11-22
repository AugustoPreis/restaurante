import { CategoriaProdutoListagemDTO } from '../../categoriaProduto/dtos/CategoriaProdutoListagemDTO';

export type ProdutoConsultaDTO = Partial<{
  codigo: string;
  nome: string;
  descricao: string;
  valor: number;
  movimentaEstoque: boolean;
  categoria: CategoriaProdutoListagemDTO;
}>