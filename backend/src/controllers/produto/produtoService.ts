import { produtoRepository } from '.';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { CategoriaProduto } from '../../models/CategoriaProduto';
import { Empresa } from '../../models/Empresa';
import { Produto } from '../../models/Produto';
import { Usuario } from '../../models/Usuario';
import { RequestError } from '../../utils/RequestError';
import { round } from '../../utils/number';
import { defaultParams } from '../../utils/params';
import { isImage, isValidNumber, isValidString } from '../../utils/validators';
import { funcaoRepository } from '../funcao';
import { UsuarioLogadoDTO } from '../usuario/dtos/UsuarioLogadoDTO';
import { ProdutoAtualizacaoDTO } from './dtos/ProdutoAtualizacaoDTO';
import { ProdutoAtualizacaoRetornoDTO } from './dtos/ProdutoAtualizacaoRetornoDTO';
import { ProdutoAtualizarFotoDTO } from './dtos/ProdutoAtualizarFotoDTO';
import { ProdutoAtualizarFotoResultadoDTO } from './dtos/ProdutoAtualizarFotoResultadoDTO';
import { ProdutoCadastroDTO } from './dtos/ProdutoCadastroDTO';
import { ProdutoCadastroRetornoDTO } from './dtos/ProdutoCadastroRetornoDTO';
import { ProdutoConsultaDTO } from './dtos/ProdutoConsultaDTO';
import { ProdutoListagemDTO } from './dtos/ProdutoListagemDTO';
import { ProdutoListagemParametrosDTO } from './dtos/ProdutoListagemParametrosDTO';
import { ProdutoListagemResultadoDTO } from './dtos/ProdutoListagemResultadoDTO';

export class ProdutoService {

  async listar(produtoListagemParametrosDTO: ProdutoListagemParametrosDTO, usuarioLogado: UsuarioLogadoDTO): Promise<ProdutoListagemResultadoDTO> {
    const parametros = defaultParams<ProdutoListagemParametrosDTO>(produtoListagemParametrosDTO, usuarioLogado);

    parametros.movimentaEstoque = produtoListagemParametrosDTO.movimentaEstoque?.toString() === 'true';

    const [produtosModel, total] = await produtoRepository.listar(parametros);

    const produtosListagemDTO: ProdutoListagemDTO[] = [];

    for (let i = 0; i < produtosModel.length; i++) {
      const produtoModel = produtosModel[i];
      const produtoListagemDTO: ProdutoListagemDTO = {};

      produtoListagemDTO.id = produtoModel.id;
      produtoListagemDTO.uuid = produtoModel.uuid;
      produtoListagemDTO.codigo = produtoModel.codigo;
      produtoListagemDTO.nome = produtoModel.nome;
      produtoListagemDTO.valor = produtoModel.valor;
      produtoListagemDTO.estoque = await funcaoRepository.estoqueAtual(produtoModel.id);
      produtoListagemDTO.categoria = {};

      produtoListagemDTO.categoria.descricao = produtoModel.categoria.descricao;

      produtosListagemDTO.push(produtoListagemDTO);
    }

    return { data: produtosListagemDTO, total };
  }

  async buscarPorId(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<ProdutoConsultaDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do produto não informado');
    }

    const produtoModel = await produtoRepository.buscarPorId(id);

    if (!produtoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Produto não encontrado');
    }

    if (produtoModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Produto não pertence a empresa do usuário');
    }

    const produtoConsultaDTO: ProdutoConsultaDTO = {};

    produtoConsultaDTO.codigo = produtoModel.codigo;
    produtoConsultaDTO.nome = produtoModel.nome;
    produtoConsultaDTO.descricao = produtoModel.descricao;
    produtoConsultaDTO.valor = produtoModel.valor;
    produtoConsultaDTO.movimentaEstoque = produtoModel.movimentaEstoque;
    produtoConsultaDTO.categoria = {};

    produtoConsultaDTO.categoria.id = produtoModel.categoria.id;
    produtoConsultaDTO.categoria.descricao = produtoModel.categoria.descricao;

    return produtoConsultaDTO;
  }

  async buscarFoto(uuid: string): Promise<Buffer> {
    if (!isValidString(uuid)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'UUID do produto inválido');
    }

    const fotoProduto = await produtoRepository.buscarFoto(uuid);

    if (!Buffer.isBuffer(fotoProduto) || fotoProduto.length === 0) {
      return null;
    }

    return fotoProduto;
  }

  async cadastrar(produtoCadastroDTO: ProdutoCadastroDTO, usuarioLogado: UsuarioLogadoDTO): Promise<ProdutoCadastroRetornoDTO> {
    const { codigo, nome, descricao, valor, categoriaId, movimentaEstoque } = produtoCadastroDTO;

    if (!isValidString(codigo, { minLength: 1, maxLength: 20 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Código do produto inválido');
    }

    if (!isValidString(nome, { minLength: 1, maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Nome do produto inválido');
    }

    if (!isValidNumber(categoriaId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID da categoria do produto inválido');
    }

    const produtoModel = new Produto();

    produtoModel.uuid = crypto.randomUUID();
    produtoModel.codigo = codigo.trim();
    produtoModel.nome = nome.trim();
    produtoModel.movimentaEstoque = !!movimentaEstoque;
    produtoModel.categoria = new CategoriaProduto(categoriaId);

    if (isValidString(descricao, { minLength: 1 })) {
      produtoModel.descricao = descricao.trim();
    }

    if (isValidNumber(valor, { min: 0, max: 99999.99 })) {
      produtoModel.valor = round(valor, 2);
    }

    produtoModel.dataCadastro = new Date();
    produtoModel.usuarioCadastrou = new Usuario(usuarioLogado.id);
    produtoModel.empresa = new Empresa(usuarioLogado.empresa.id);

    const produtoComCodigo = await produtoRepository.buscarPorCodigo(produtoModel);

    if (produtoComCodigo) {
      throw new RequestError(HttpStatusCode.UNPROCESSABLE_ENTITY, `Código "${produtoComCodigo.codigo}" já cadastrado no produto "${produtoComCodigo.nome}"`);
    }

    const produtoSalvo = await produtoRepository.salvar(produtoModel);

    const produtoCadastroRetornoDTO: ProdutoCadastroRetornoDTO = {};

    produtoCadastroRetornoDTO.id = produtoSalvo.id;
    produtoCadastroRetornoDTO.dataCadastro = produtoSalvo.dataCadastro;

    return produtoCadastroRetornoDTO;
  }

  async atualizar(produtoAtualizacaoDTO: ProdutoAtualizacaoDTO, usuarioLogado: UsuarioLogadoDTO): Promise<ProdutoAtualizacaoRetornoDTO> {
    const { id, nome, descricao, valor, categoriaId, movimentaEstoque } = produtoAtualizacaoDTO;

    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do produto não informado');
    }

    if (!isValidString(nome, { minLength: 1, maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Nome do produto inválido');
    }

    if (!isValidNumber(categoriaId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID da categoria do produto inválido');
    }

    const produtoModel = await produtoRepository.buscarPorId(id);

    if (!produtoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Produto não encontrado');
    }

    if (produtoModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Produto não pertence a empresa do usuário');
    }

    produtoModel.nome = nome.trim();
    produtoModel.categoria = new CategoriaProduto(categoriaId);
    produtoModel.movimentaEstoque = !!movimentaEstoque;

    if (isValidString(descricao, { minLength: 1 })) {
      produtoModel.descricao = descricao.trim();
    } else {
      produtoModel.descricao = null;
    }

    if (isValidNumber(valor, { min: 0, max: 99999.99 })) {
      produtoModel.valor = round(valor, 2);
    } else {
      produtoModel.valor = null;
    }

    produtoModel.dataAlteracao = new Date();
    produtoModel.usuarioAlterou = new Usuario(usuarioLogado.id);

    const produtoSalvo = await produtoRepository.salvar(produtoModel);

    const produtoAtualizacaoRetornoDTO: ProdutoAtualizacaoRetornoDTO = {};

    produtoAtualizacaoRetornoDTO.codigo = produtoSalvo.codigo;
    produtoAtualizacaoRetornoDTO.dataAlteracao = produtoSalvo.dataAlteracao;

    return produtoAtualizacaoRetornoDTO;
  }

  async atualizarFoto(produtoAtualizarFotoDTO: ProdutoAtualizarFotoDTO, usuarioLogado: UsuarioLogadoDTO): Promise<ProdutoAtualizarFotoResultadoDTO> {
    const { id, foto } = produtoAtualizarFotoDTO;

    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do produto não informado');
    }

    if (!isImage(foto)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Foto do produto inválida');
    }

    const produtoModel = await produtoRepository.buscarPorId(id);

    if (!produtoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Produto não encontrado');
    }

    if (produtoModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Produto não pertence a empresa do usuário');
    }

    produtoModel.foto = foto;
    produtoModel.dataAlteracao = new Date();
    produtoModel.usuarioAlterou = new Usuario(usuarioLogado.id);

    const produtoSalvo = await produtoRepository.salvar(produtoModel);

    const produtoAtualizarFotoResultadoDTO: ProdutoAtualizarFotoResultadoDTO = {};

    produtoAtualizarFotoResultadoDTO.uuid = produtoSalvo.uuid;

    return produtoAtualizarFotoResultadoDTO;
  }

  async inativar(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<ProdutoAtualizacaoRetornoDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do produto não informado');
    }

    const produtoModel = await produtoRepository.buscarPorId(id);

    if (!produtoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Produto não encontrado');
    }

    if (produtoModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Produto não pertence a empresa do usuário');
    }

    produtoModel.ativo = false;
    produtoModel.dataAlteracao = new Date();
    produtoModel.usuarioAlterou = new Usuario(usuarioLogado.id);

    const produtoSalvo = await produtoRepository.salvar(produtoModel);

    const produtoAtualizacaoRetornoDTO: ProdutoAtualizacaoRetornoDTO = {};

    produtoAtualizacaoRetornoDTO.codigo = produtoSalvo.codigo;
    produtoAtualizacaoRetornoDTO.dataAlteracao = produtoSalvo.dataAlteracao;

    return produtoAtualizacaoRetornoDTO;
  }
}