import { usuarioRepository } from '.';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { signJWT } from '../../providers/jwt';
import { Crypt } from '../../utils/crypt';
import { RequestError } from '../../utils/RequestError';
import { isValidString } from '../../utils/validators';
import { UsuarioLogadoDTO } from './dtos/UsuarioLogadoDTO';
import { UsuarioLoginDTO } from './dtos/UsuarioLoginDTO';

export class UsuarioService {

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
}