import { pagamentoController } from '.';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class PagamentoRoutes extends DefaultRouter {
  constructor() {
    super();

    this.get('/:pedidoId/:comanda', (req, res, next) => {
      pagamentoController.buscarPorComandaPedido(req, res, next);
    });

    this.post('/', (req, res, next) => {
      pagamentoController.cadastrar(req, res, next);
    });

    this.put('/:id/inativar', (req, res, next) => {
      pagamentoController.inativar(req, res, next);
    });
  }
}