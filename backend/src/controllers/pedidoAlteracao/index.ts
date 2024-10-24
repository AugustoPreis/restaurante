import { PedidoAlteracaoRepository } from './pedidoAlteracaoRepository';
import { PedidoAlteracaoService } from './pedidoAlteracaoService';

const pedidoAlteracaoService = new PedidoAlteracaoService();
const pedidoAlteracaoRepository = new PedidoAlteracaoRepository();

export {
  pedidoAlteracaoService,
  pedidoAlteracaoRepository,
}