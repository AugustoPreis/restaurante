import { CategoriaProdutoController } from './categoriaProdutoController';
import { CategoriaProdutoRepository } from './categoriaProdutoRepository';
import { CategoriaProdutoRoutes } from './categoriaProdutoRoutes';
import { CategoriaProdutoService } from './categoriaProdutoService';

const categoriaProdutoController = new CategoriaProdutoController();
const categoriaProdutoService = new CategoriaProdutoService();
const categoriaProdutoRepository = new CategoriaProdutoRepository();
const categoriaProdutoRoutes = new CategoriaProdutoRoutes();

export {
  categoriaProdutoController,
  categoriaProdutoService,
  categoriaProdutoRepository,
  categoriaProdutoRoutes,
}