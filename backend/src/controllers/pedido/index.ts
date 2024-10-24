import { PedidoController } from './pedidoController';
import { PedidoRepository } from './pedidoRepository';
import { PedidoRoutes } from './pedidoRoutes';
import { PedidoService } from './pedidoService';

const pedidoController = new PedidoController();
const pedidoService = new PedidoService();
const pedidoRepository = new PedidoRepository();
const pedidoRoutes = new PedidoRoutes();

export {
  pedidoController,
  pedidoService,
  pedidoRepository,
  pedidoRoutes,
}