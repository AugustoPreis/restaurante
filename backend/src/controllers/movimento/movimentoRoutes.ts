import { movimentoController } from '.';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class MovimentoRoutes extends DefaultRouter {
  constructor() {
    super();

    this.get('/:produtoId', (req, res, next) => {
      movimentoController.listarPorProduto(req, res, next);
    });
  }
}