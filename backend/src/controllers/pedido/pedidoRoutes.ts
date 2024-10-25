import { pedidoController } from '.';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class PedidoRoutes extends DefaultRouter {
  constructor() {
    super();

    this.get('/', (req, res, next) => {
      pedidoController.listar(req, res, next);
    })

    this.get('/:id', (req, res, next) => {
      pedidoController.buscarPorId(req, res, next);
    });

    this.get('/:id/dados-pagamento', (req, res, next) => {
      pedidoController.buscarDadosPagamento(req, res, next);
    })

    this.post('/', (req, res, next) => {
      pedidoController.cadastrar(req, res, next);
    });

    this.put('/:id', (req, res, next) => {
      pedidoController.atualizar(req, res, next);
    });

    this.put('/:id/inativar', (req, res, next) => {
      pedidoController.inativar(req, res, next);
    });
  }
}