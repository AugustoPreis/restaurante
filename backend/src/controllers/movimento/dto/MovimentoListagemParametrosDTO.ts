import { DefaultParams } from '../../../types/DefaultParams';

export type MovimentoListagemParametrosDTO = Partial<DefaultParams & {
  produtoId: number;
}>