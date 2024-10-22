import { produtoController } from '.';
import { isAdmin } from '../../middlewares/admin';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class ProdutoRoutes extends DefaultRouter {
  constructor() {
    super();

    this.get('/', (req, res, next) => {
      produtoController.listar(req, res, next);
    });

    this.get('/:id', (req, res, next) => {
      produtoController.buscarPorId(req, res, next);
    });

    this.post('/', (req, res, next) => {
      produtoController.cadastrar(req, res, next);
    }, isAdmin);

    this.put('/:id', (req, res, next) => {
      produtoController.atualizar(req, res, next);
    }, isAdmin);

    this.put('/:id/inativar', (req, res, next) => {
      produtoController.inativar(req, res, next);
    }, isAdmin);
  }
}