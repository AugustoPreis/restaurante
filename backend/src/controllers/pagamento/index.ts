import { PagamentoController } from './pagamentoController';
import { PagamentoRepository } from './pagamentoRepository';
import { PagamentoRoutes } from './pagamentoRoutes';
import { PagamentoService } from './pagamentoService';

const pagamentoController = new PagamentoController();
const pagamentoService = new PagamentoService();
const pagamentoRepository = new PagamentoRepository();
const pagamentoRoutes = new PagamentoRoutes();

export {
  pagamentoController,
  pagamentoService,
  pagamentoRepository,
  pagamentoRoutes,
}