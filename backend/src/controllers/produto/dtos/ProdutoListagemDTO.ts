import { CategoriaProdutoConsultaDTO } from '../../categoriaProduto/dtos/CategoriaProdutoConsultaDTO';

export type ProdutoListagemDTO = Partial<{
  id: number;
  uuid: string;
  codigo: string;
  nome: string;
  valor: number;
  categoria: CategoriaProdutoConsultaDTO;
}>