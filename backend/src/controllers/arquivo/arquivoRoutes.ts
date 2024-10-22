import { arquivoController } from '.';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class ArquivoRoutes extends DefaultRouter {
  constructor() {
    super();

    this.get('/foto-produto/:uuid', (req, res, next) => {
      arquivoController.fotoProduto(req, res, next);
    })
  }
}