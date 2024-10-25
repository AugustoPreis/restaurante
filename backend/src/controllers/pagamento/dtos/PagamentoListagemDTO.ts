import { FormaPagamentoListagemDTO } from '../../formaPagamento/dtos/FormaPagamentoListagemDTO';

export type PagamentoListagemDTO = Partial<{
  id: number;
  valor: number;
  formaPagamento: FormaPagamentoListagemDTO;
  dataCadastro: Date;
}>