import { categoriaProdutoController } from '.';
import { isAdmin } from '../../middlewares/admin';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class CategoriaProdutoRoutes extends DefaultRouter {
  constructor() {
    super();

    this.get('/', (req, res, next) => {
      categoriaProdutoController.listar(req, res, next);
    });

    this.get('/:id', (req, res, next) => {
      categoriaProdutoController.buscarPorId(req, res, next);
    });

    this.post('/', (req, res, next) => {
      categoriaProdutoController.cadastrar(req, res, next);
    }, isAdmin);

    this.put('/:id', (req, res, next) => {
      categoriaProdutoController.atualizar(req, res, next);
    }, isAdmin);

    this.put('/:id/inativar', (req, res, next) => {
      categoriaProdutoController.inativar(req, res, next);
    }, isAdmin);
  }
}