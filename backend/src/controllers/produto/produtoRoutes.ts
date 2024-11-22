import multer from 'multer';
import { produtoController } from '.';
import { isAdmin } from '../../middlewares/admin';
import { DefaultRouter } from '../../middlewares/defaultRouter';

export class ProdutoRoutes extends DefaultRouter {
  constructor() {
    super();

    const upload = multer();

    this.get('/', (req, res, next) => {
      produtoController.listar(req, res, next);
    });

    this.get('/:id', (req, res, next) => {
      produtoController.buscarPorId(req, res, next);
    });

    this.post('/', (req, res, next) => {
      produtoController.cadastrar(req, res, next);
    }, isAdmin);

    this.post('/:id/estoque', (req, res, next) => {
      produtoController.movimentarEstoque(req, res, next);
    });

    this.put('/:id', (req, res, next) => {
      produtoController.atualizar(req, res, next);
    }, isAdmin);

    this.putUpload('/:id/foto', (req, res, next) => {
      produtoController.atualizarFoto(req, res, next);
    }, [isAdmin, upload.single('arquivo_1')]);


    this.put('/:id/inativar', (req, res, next) => {
      produtoController.inativar(req, res, next);
    }, isAdmin);

    this.delete('/:id/estoque', (req, res, next) => {
      produtoController.movimentarEstoque(req, res, next);
    });
  }
}