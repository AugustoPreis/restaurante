import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { apiRoutes } from './api.routes';
import { verifyJWT } from '../middlewares/jwt';
import { usuarioController } from '../controllers/usuario';
import { arquivoRoutes } from '../controllers/arquivo';

const routes = Router();

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_, res) => {
    res.status(429).json({ message: 'Muitas tentativas de login, tente novamente em 5 minutos.' });
  },
});

routes.post('/login', loginLimiter, (req, res, next) => {
  usuarioController.login(req, res, next);
});

routes.use('/api', verifyJWT, apiRoutes);

routes.use('/arquivo', arquivoRoutes.router);

export { routes };