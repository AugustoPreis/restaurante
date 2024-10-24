import { FormaPagamentoController } from './formaPagamentoController';
import { FormaPagamentoRepository } from './formaPagamentoRepository';
import { FormaPagamentoRoutes } from './formaPagamentoRoutes';
import { FormaPagamentoService } from './formaPagamentoService';

const formaPagamentoController = new FormaPagamentoController();
const formaPagamentoService = new FormaPagamentoService();
const formaPagamentoRepository = new FormaPagamentoRepository();
const formaPagamentoRoutes = new FormaPagamentoRoutes();

export {
  formaPagamentoController,
  formaPagamentoService,
  formaPagamentoRepository,
  formaPagamentoRoutes,
}