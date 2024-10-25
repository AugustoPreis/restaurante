import { ArquivoController } from './arquivoController';
import { ArquivoRepository } from './arquivoRepository';
import { ArquivoRoutes } from './arquivoRoutes';
import { ArquivoService } from './arquivoService';

const arquivoController = new ArquivoController();
const arquivoService = new ArquivoService();
const arquivoRepository = new ArquivoRepository();
const arquivoRoutes = new ArquivoRoutes();

export {
  arquivoController,
  arquivoService,
  arquivoRepository,
  arquivoRoutes,
}