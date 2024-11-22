import { MovimentoRepository } from './movimentoRepository';
import { MovimentoService } from './movimentoService';

const movimentoService = new MovimentoService();
const movimentoRepository = new MovimentoRepository();

export {
  movimentoService,
  movimentoRepository,
}