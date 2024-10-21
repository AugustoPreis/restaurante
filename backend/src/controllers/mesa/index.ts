import { MesaController } from './mesaController';
import { MesaRepository } from './mesaRepository';
import { MesaRoutes } from './mesaRoutes';
import { MesaService } from './mesaService';

const mesaController = new MesaController();
const mesaService = new MesaService();
const mesaRepository = new MesaRepository();
const mesaRoutes = new MesaRoutes();

export {
  mesaController,
  mesaService,
  mesaRepository,
  mesaRoutes,
}