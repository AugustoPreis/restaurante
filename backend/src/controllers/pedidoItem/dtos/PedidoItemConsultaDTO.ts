import { ProdutoListagemDTO } from '../../produto/dtos/ProdutoListagemDTO';

export type PedidoItemConsultaDTO = Partial<{
  id: number;
  comanda: number;
  produto: ProdutoListagemDTO;
  quantidade: number;
  valor: number;
}>