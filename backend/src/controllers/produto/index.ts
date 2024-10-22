import { ProdutoController } from './produtoController';
import { ProdutoRepository } from './produtoRepository';
import { ProdutoRoutes } from './produtoRoutes';
import { ProdutoService } from './produtoService';

const produtoController = new ProdutoController();
const produtoService = new ProdutoService();
const produtoRepository = new ProdutoRepository();
const produtoRoutes = new ProdutoRoutes();

export {
  produtoController,
  produtoService,
  produtoRepository,
  produtoRoutes,
};