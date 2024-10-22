import { usuarioRepository } from '.';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { Empresa } from '../../models/Empresa';
import { Usuario } from '../../models/Usuario';
import { signJWT } from '../../providers/jwt';
import { Crypt } from '../../utils/crypt';
import { defaultParams } from '../../utils/params';
import { RequestError } from '../../utils/RequestError';
import { isValidNumber, isValidString } from '../../utils/validators';
import { UsuarioAtualizacaoDTO } from './dtos/UsuarioAtualizacaoDTO';
import { UsuarioAtualizacaoRetornoDTO } from './dtos/UsuarioAtualizacaoRetornoDTO';
import { UsuarioCadastroDTO } from './dtos/UsuarioCadastroDTO';
import { UsuarioCadastroRetornoDTO } from './dtos/UsuarioCadastroRetornoDTO';
import { UsuarioConsultaDTO } from './dtos/UsuarioConsultaDTO';
import { UsuarioListagemDTO } from './dtos/UsuarioListagemDTO';
import { UsuarioListagemParametrosDTO } from './dtos/UsuarioListagemParametrosDTO';
import { UsuarioListagemResultadoDTO } from './dtos/UsuarioListagemResultadoDTO';
import { UsuarioLogadoDTO } from './dtos/UsuarioLogadoDTO';
import { UsuarioLoginDTO } from './dtos/UsuarioLoginDTO';

export class UsuarioService {

  async listar(usuarioListagemParametrosDTO: UsuarioListagemParametrosDTO, usuarioLogado: UsuarioLogadoDTO): Promise<UsuarioListagemResultadoDTO> {
    const parametros = defaultParams(usuarioListagemParametrosDTO, usuarioLogado);

    const [usuariosModel, total] = await usuarioRepository.listar(parametros);

    const usuariosListagemDTO: UsuarioListagemDTO[] = [];

    for (let i = 0; i < usuariosModel.length; i++) {
      const usuarioModel = usuariosModel[i];
      const usuarioListagemDTO: UsuarioListagemDTO = {};

      usuarioListagemDTO.id = usuarioModel.id;
      usuarioListagemDTO.nome = usuarioModel.nome;
      usuarioListagemDTO.admin = usuarioModel.admin;

      usuariosListagemDTO.push(usuarioListagemDTO);
    }

    return { data: usuariosListagemDTO, total };
  }

  async buscarPorId(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<UsuarioConsultaDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do usuário inválido');
    }

    const usuarioModel = await usuarioRepository.buscarPorId(id);

    if (!usuarioModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Usuário não encontrado');
    }

    if (usuarioModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Usuário não pertence a empresa do usuário logado');
    }

    const usuarioConsultaDTO: UsuarioConsultaDTO = {};

    usuarioConsultaDTO.nome = usuarioModel.nome;
    usuarioConsultaDTO.login = usuarioModel.login;
    usuarioConsultaDTO.admin = usuarioModel.admin;

    return usuarioConsultaDTO;
  }

  async login(usuarioLoginDTO: UsuarioLoginDTO): Promise<UsuarioLogadoDTO> {
    const { login, senha } = usuarioLoginDTO;

    if (!isValidString(login, { maxLength: 100 }) || !isValidString(senha)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Dados de login não informados/inválidos');
    }

    const usuariosModel = await usuarioRepository.buscarPorLogin(login);

    if (!usuariosModel.length) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Login inválido');
    }

    if (usuariosModel.length > 1) {
      throw new RequestError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Mais de um usuário com o mesmo login encontrado, entrar em contato com o suporte do sistema');
    }

    const usuarioModel = usuariosModel[0];

    if (!Crypt.compare(senha, usuarioModel.senha)) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Login inválido');
    }

    const usuarioLogadoDTO: UsuarioLogadoDTO = {};

    usuarioLogadoDTO.id = usuarioModel.id;
    usuarioLogadoDTO.nome = usuarioModel.nome;
    usuarioLogadoDTO.admin = usuarioModel.admin;
    usuarioLogadoDTO.empresa = {};

    usuarioLogadoDTO.empresa.id = usuarioModel.empresa.id;
    usuarioLogadoDTO.empresa.razaoSocial = usuarioModel.empresa.razaoSocial;
    usuarioLogadoDTO.empresa.nomeFantasia = usuarioModel.empresa.nomeFantasia;
    usuarioLogadoDTO.empresa.cnpj = usuarioModel.empresa.cnpj;

    usuarioLogadoDTO.token = signJWT(usuarioLogadoDTO);

    return usuarioLogadoDTO;
  }

  async cadastrar(usuarioCadastroDTO: UsuarioCadastroDTO, usuarioLogado: UsuarioLogadoDTO): Promise<UsuarioCadastroRetornoDTO> {
    const { nome, login, senha, admin } = usuarioCadastroDTO;

    if (!isValidString(nome, { maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Nome do usuário inválido');
    }

    if (!isValidString(login, { maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Login do usuário inválido');
    }

    if (!isValidString(senha)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Senha do usuário inválida');
    }

    const usuarioModel = new Usuario();

    usuarioModel.nome = nome.trim();
    usuarioModel.login = login.trim();
    usuarioModel.senha = Crypt.hash(senha);
    usuarioModel.admin = !!admin;
    usuarioModel.dataCadastro = new Date();
    usuarioModel.usuarioCadastrou = new Usuario(usuarioLogado.id);
    usuarioModel.empresa = new Empresa(usuarioLogado.empresa.id);

    const usuarioComLogin = await usuarioRepository.buscarPorLogin(usuarioModel.login);

    if (usuarioComLogin.length) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Login já cadastrado');
    }

    const usuarioSalvo = await usuarioRepository.salvar(usuarioModel);

    const usuarioCadastroRetornoDTO: UsuarioCadastroRetornoDTO = {};

    usuarioCadastroRetornoDTO.id = usuarioSalvo.id;
    usuarioCadastroRetornoDTO.dataCadastro = usuarioSalvo.dataCadastro;

    return usuarioCadastroRetornoDTO;
  }

  async atualizar(usuarioAtualizacaoDTO: UsuarioAtualizacaoDTO, usuarioLogado: UsuarioLogadoDTO): Promise<UsuarioAtualizacaoRetornoDTO> {
    const { id, nome, login, senha, admin } = usuarioAtualizacaoDTO;

    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do usuário inválido');
    }

    if (!isValidString(nome, { maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Nome do usuário inválido');
    }

    if (!isValidString(login, { maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Login do usuário inválido');
    }

    const usuarioModel = await usuarioRepository.buscarPorId(id);

    if (!usuarioModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Usuário não encontrado');
    }

    if (usuarioModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Usuário não pertence a empresa do usuário logado');
    }

    usuarioModel.nome = nome.trim();
    usuarioModel.login = login.trim();
    usuarioModel.admin = !!admin;
    usuarioModel.dataAlteracao = new Date();
    usuarioModel.usuarioAlterou = new Usuario(usuarioLogado.id);

    if (isValidString(senha)) {
      usuarioModel.senha = Crypt.hash(senha);
    }

    const usuarioSalvo = await usuarioRepository.salvar(usuarioModel);

    const usuarioAtualizacaoRetornoDTO: UsuarioAtualizacaoRetornoDTO = {};

    usuarioAtualizacaoRetornoDTO.dataAlteracao = usuarioSalvo.dataAlteracao;

    return usuarioAtualizacaoRetornoDTO;
  }

  async inativar(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<UsuarioAtualizacaoRetornoDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do usuário inválido');
    }

    const usuarioModel = await usuarioRepository.buscarPorId(id);

    if (!usuarioModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Usuário não encontrado');
    }

    if (usuarioModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Usuário não pertence a empresa do usuário logado');
    }

    const usuarioSalvo = await usuarioRepository.salvar(usuarioModel);

    const usuarioAtualizacaoRetornoDTO: UsuarioAtualizacaoRetornoDTO = {};

    usuarioAtualizacaoRetornoDTO.dataAlteracao = usuarioSalvo.dataAlteracao;

    return usuarioAtualizacaoRetornoDTO;
  }
}