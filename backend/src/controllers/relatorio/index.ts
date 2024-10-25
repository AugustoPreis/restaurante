import { RelatorioController } from './relatorioController';
import { RelatorioRepository } from './relatorioRepository';
import { RelatorioRoutes } from './relatorioRoutes';
import { RelatorioService } from './relatorioService';

const relatorioController = new RelatorioController();
const relatorioService = new RelatorioService();
const relatorioRepository = new RelatorioRepository();
const relatorioRoutes = new RelatorioRoutes();

export {
  relatorioController,
  relatorioService,
  relatorioRepository,
  relatorioRoutes,
}