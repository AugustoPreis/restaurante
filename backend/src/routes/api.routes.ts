import { Router } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { mesaRoutes } from '../controllers/mesa';
import { categoriaProdutoRoutes } from '../controllers/categoriaProduto';

const routes = Router();

routes.use('/mesa', mesaRoutes.router);
routes.use('/categoria-produto', categoriaProdutoRoutes.router);

routes.use('*', (req, res) => {
  res.status(HttpStatusCode.NOT_FOUND).json({ message: `Não foi possível encontrar a rota: ${req.baseUrl || ''}` });
});

export { routes as apiRoutes };