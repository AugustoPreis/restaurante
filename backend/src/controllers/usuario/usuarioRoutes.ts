import { usuarioController } from '.';
import { isAdmin } from '../../middlewares/admin';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class UsuarioRoutes extends DefaultRouter {
  constructor() {
    super();

    this.get('/', (req, res, next) => {
      usuarioController.listar(req, res, next);
    }, isAdmin);

    this.get('/:id', (req, res, next) => {
      usuarioController.buscarPorId(req, res, next);
    }, isAdmin);

    this.post('/', (req, res, next) => {
      usuarioController.cadastrar(req, res, next);
    }, isAdmin);

    this.put('/:id', (req, res, next) => {
      usuarioController.atualizar(req, res, next);
    }, isAdmin);

    this.put('/:id/inativar', (req, res, next) => {
      usuarioController.inativar(req, res, next);
    }, isAdmin);
  }
}