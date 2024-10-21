import { UsuarioController } from './usuarioController';
import { UsuarioRepository } from './usuarioRepository';
import { UsuarioRoutes } from './usuarioRoutes';
import { UsuarioService } from './usuarioService';

const usuarioController = new UsuarioController();
const usuarioService = new UsuarioService();
const usuarioRepository = new UsuarioRepository();
const usuarioRoutes = new UsuarioRoutes();

export {
  usuarioController,
  usuarioService,
  usuarioRepository,
  usuarioRoutes,
}