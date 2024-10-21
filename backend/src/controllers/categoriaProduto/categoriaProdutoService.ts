import { UsuarioLogadoDTO } from '../usuario/dtos/UsuarioLogadoDTO';
import { defaultParams } from '../../utils/params';
import { CategoriaProdutoListagemParametrosDTO } from './dtos/CategoriaProdutoListagemParametrosDTO';
import { CategoriaProdutoListagemResultadoDTO } from './dtos/CategoriaProdutoListagemResultadoDTO';
import { categoriaProdutoRepository } from '.';
import { CategoriaProdutoListagemDTO } from './dtos/CategoriaProdutoListagemDTO';
import { CategoriaProdutoConsultaDTO } from './dtos/CategoriaProdutoConsultaDTO';
import { isValidNumber, isValidString } from '../../utils/validators';
import { RequestError } from '../../utils/RequestError';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { CategoriaProdutoCadastroDTO } from './dtos/CategoriaProdutoCadastroDTO';
import { CategoriaProduto } from '../../models/CategoriaProduto';
import { Usuario } from '../../models/Usuario';
import { Empresa } from '../../models/Empresa';
import { CategoriaProdutoCadastroRetornoDTO } from './dtos/CategoriaProdutoCadastroRetornoDTO';
import { CategoriaProdutoAtualizacaoDTO } from './dtos/CategoriaProdutoAtualizacaoDTO';
import { CategoriaProdutoAtualizacaoRetornoDTO } from './dtos/CategoriaProdutoAtualizacaoRetornoDTO';

export class CategoriaProdutoService {

  async listar(categoriaProdutoListagemParametrosDTO: CategoriaProdutoListagemParametrosDTO, usuarioLogado: UsuarioLogadoDTO): Promise<CategoriaProdutoListagemResultadoDTO> {
    const parametros = defaultParams(categoriaProdutoListagemParametrosDTO, usuarioLogado);

    const [categoriasProdutoListagemModel, total] = await categoriaProdutoRepository.listar(parametros);

    const categoriasProdutoListagemDTO: CategoriaProdutoListagemDTO[] = [];

    for (let i = 0; i < categoriasProdutoListagemModel.length; i++) {
      const categoriaProdutoListagemModel = categoriasProdutoListagemModel[i];

      const categoriaProdutoListagemDTO: CategoriaProdutoListagemDTO = {};

      categoriaProdutoListagemDTO.id = categoriaProdutoListagemModel.id;
      categoriaProdutoListagemDTO.descricao = categoriaProdutoListagemModel.descricao;

      categoriasProdutoListagemDTO.push(categoriaProdutoListagemDTO);
    }

    return { data: categoriasProdutoListagemDTO, total };
  }

  async buscarPorId(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<CategoriaProdutoConsultaDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Código da categoria do produto não informado');
    }

    const categoriaProdutoModel = await categoriaProdutoRepository.buscarPorId(id);

    if (!categoriaProdutoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Categoria do produto não encontrada');
    }

    if (categoriaProdutoModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Categoria do produto não pertence a empresa do usuário');
    }

    const categoriaProdutoConsultaDTO: CategoriaProdutoConsultaDTO = {};

    categoriaProdutoConsultaDTO.descricao = categoriaProdutoModel.descricao;

    return categoriaProdutoConsultaDTO;
  }

  async cadastrar(categoriaProdutoCadastroDTO: CategoriaProdutoCadastroDTO, usuarioLogado: UsuarioLogadoDTO): Promise<CategoriaProdutoCadastroRetornoDTO> {
    const { descricao } = categoriaProdutoCadastroDTO;

    if (!isValidString(descricao, { maxLength: 50 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Descrição da categoria do produto inválida');
    }

    const categoriaProdutoModel = new CategoriaProduto();

    categoriaProdutoModel.descricao = descricao.trim();
    categoriaProdutoModel.dataCadastro = new Date();
    categoriaProdutoModel.usuarioCadastrou = new Usuario(usuarioLogado.id);
    categoriaProdutoModel.empresa = new Empresa(usuarioLogado.empresa.id);

    const categoriaProdutoSalva = await categoriaProdutoRepository.salvar(categoriaProdutoModel);

    const categoriaProdutoCadastroRetornoDTO: CategoriaProdutoCadastroRetornoDTO = {};

    categoriaProdutoCadastroRetornoDTO.id = categoriaProdutoSalva.id;
    categoriaProdutoCadastroRetornoDTO.dataCadastro = categoriaProdutoSalva.dataCadastro;

    return categoriaProdutoCadastroRetornoDTO;
  }

  async atualizar(categoriaProdutoAtualizacaoDTO: CategoriaProdutoAtualizacaoDTO, usuarioLogado: UsuarioLogadoDTO): Promise<CategoriaProdutoAtualizacaoRetornoDTO> {
    const { id, descricao } = categoriaProdutoAtualizacaoDTO;

    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Código da categoria do produto não informado');
    }

    if (!isValidString(descricao, { maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Descrição da categoria do produto inválida');
    }

    const categoriaProdutoModel = await categoriaProdutoRepository.buscarPorId(id);

    if (!categoriaProdutoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Categoria do produto não encontrada');
    }

    categoriaProdutoModel.descricao = descricao.trim();
    categoriaProdutoModel.dataAlteracao = new Date();
    categoriaProdutoModel.usuarioAlterou = new Usuario(usuarioLogado.id);

    const categoriaProdutoSalva = await categoriaProdutoRepository.salvar(categoriaProdutoModel);

    const categoriaProdutoAtualizacaoRetornoDTO: CategoriaProdutoAtualizacaoRetornoDTO = {};

    categoriaProdutoAtualizacaoRetornoDTO.dataAlteracao = categoriaProdutoSalva.dataAlteracao;

    return categoriaProdutoAtualizacaoRetornoDTO;
  }

  async inativar(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<CategoriaProdutoAtualizacaoRetornoDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Código da categoria do produto não informado');
    }

    const categoriaProdutoModel = await categoriaProdutoRepository.buscarPorId(id);

    if (!categoriaProdutoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Categoria do produto não encontrada');
    }

    if (categoriaProdutoModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Categoria do produto não pertence a empresa do usuário');
    }

    categoriaProdutoModel.ativo = false;
    categoriaProdutoModel.dataAlteracao = new Date();
    categoriaProdutoModel.usuarioAlterou = new Usuario(usuarioLogado.id);

    const categoriaProdutoSalva = await categoriaProdutoRepository.salvar(categoriaProdutoModel);

    const categoriaProdutoAtualizacaoRetornoDTO: CategoriaProdutoAtualizacaoRetornoDTO = {};

    categoriaProdutoAtualizacaoRetornoDTO.dataAlteracao = categoriaProdutoSalva.dataAlteracao;

    return categoriaProdutoAtualizacaoRetornoDTO;
  }
}