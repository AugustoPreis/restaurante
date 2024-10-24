import { MesaConsultaDTO } from '../../mesa/dtos/MesaConsultaDTO';

export type PedidoListagemDTO = Partial<{
  id: number;
  numero: number;
  mesa: MesaConsultaDTO;
  valor: number;
  dataCadastro: Date;
}>