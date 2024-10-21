import { EmpresaController } from './empresaController';
import { EmpresaRepository } from './empresaRepository';
import { EmpresaRoutes } from './empresaRoutes';
import { EmpresaService } from './empresaService';

const empresaController = new EmpresaController();
const empresaService = new EmpresaService();
const empresaRepository = new EmpresaRepository();
const empresaRoutes = new EmpresaRoutes();

export {
  empresaController,
  empresaService,
  empresaRepository,
  empresaRoutes,
}