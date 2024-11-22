import { MovimentoController } from './movimentoController';
import { MovimentoRepository } from './movimentoRepository';
import { MovimentoRoutes } from './movimentoRoutes';
import { MovimentoService } from './movimentoService';

const movimentoController = new MovimentoController();
const movimentoService = new MovimentoService();
const movimentoRepository = new MovimentoRepository();
const movimentoRoutes = new MovimentoRoutes();

export {
  movimentoController,
  movimentoService,
  movimentoRepository,
  movimentoRoutes,
}