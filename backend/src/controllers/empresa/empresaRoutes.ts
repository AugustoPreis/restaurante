import { empresaController } from '.';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class EmpresaRoutes extends DefaultRouter {
  constructor() {
    super();

    this.get('/:id', (req, res, next) => {
      empresaController.buscarPorId(req, res, next);
    });

    this.put('/:id', (req, res, next) => {
      empresaController.atualizar(req, res, next);
    });
  }
}