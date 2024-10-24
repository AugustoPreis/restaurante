import { PedidoItemRepository } from './pedidoItemRepository';
import { PedidoItemService } from './pedidoItemService';

const pedidoItemService = new PedidoItemService();
const pedidoItemRepository = new PedidoItemRepository();

export {
  pedidoItemService,
  pedidoItemRepository,
}