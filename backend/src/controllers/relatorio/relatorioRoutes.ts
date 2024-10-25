import { relatorioController } from '.';
import { isAdmin } from '../../middlewares/admin';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class RelatorioRoutes extends DefaultRouter {
  constructor() {
    super();

    this.get('/', (req, res, next) => {
      relatorioController.listar(req, res, next);
    }, isAdmin);

    this.post('/:id', (req, res, next) => {
      relatorioController.imprimirPorId(req, res, next);
    }, isAdmin);
  }
}