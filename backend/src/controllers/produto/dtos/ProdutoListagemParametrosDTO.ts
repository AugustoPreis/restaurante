import { DefaultParams } from '../../../types/DefaultParams';

export type ProdutoListagemParametrosDTO = Partial<DefaultParams> & {
  movimentaEstoque: boolean;
}