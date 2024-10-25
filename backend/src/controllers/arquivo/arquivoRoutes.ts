import { arquivoController } from '.';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class ArquivoRoutes extends DefaultRouter {
  constructor() {
    super();

    this.get('/foto-produto/:uuid', (req, res, next) => {
      arquivoController.fotoProduto(req, res, next);
    });

    this.get('/:tipo/:uuid', (req, res, next) => {
      arquivoController.buscarPorUuid(req, res, next);
    })
  }
}