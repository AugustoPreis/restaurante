import { Router } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { empresaRoutes } from '../controllers/empresa';
import { mesaRoutes } from '../controllers/mesa';
import { categoriaProdutoRoutes } from '../controllers/categoriaProduto';
import { usuarioRoutes } from '../controllers/usuario';

const routes = Router();

routes.use('/empresa', empresaRoutes.router);
routes.use('/mesa', mesaRoutes.router);
routes.use('/categoria-produto', categoriaProdutoRoutes.router);
routes.use('/usuario', usuarioRoutes.router);

routes.use('*', (req, res) => {
  res.status(HttpStatusCode.NOT_FOUND).json({ message: `Não foi possível encontrar a rota: ${req.baseUrl || ''}` });
});

export { routes as apiRoutes };