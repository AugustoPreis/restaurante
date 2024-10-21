import { mesaController } from '.';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class MesaRoutes extends DefaultRouter {
  constructor() {
    super();

    this.get('/', (req, res, next) => {
      mesaController.listar(req, res, next);
    });

    this.get('/:id', (req, res, next) => {
      mesaController.buscarPorId(req, res, next);
    });

    this.post('/', (req, res, next) => {
      mesaController.cadastrar(req, res, next);
    });

    this.put('/:id', (req, res, next) => {
      mesaController.atualizar(req, res, next);
    });

    this.put('/:id/inativar', (req, res, next) => {
      mesaController.inativar(req, res, next);
    });
  }
}