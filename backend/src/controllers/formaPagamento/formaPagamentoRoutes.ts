import { formaPagamentoController } from '.';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class FormaPagamentoRoutes extends DefaultRouter {
  constructor() {
    super();

    this.get('/', (req, res, next) => {
      formaPagamentoController.listar(req, res, next);
    });
  }
}