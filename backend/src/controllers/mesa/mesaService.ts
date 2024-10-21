import { mesaRepository } from '.';
import { isValidNumber, isValidString } from '../../utils/validators';
import { UsuarioLogadoDTO } from '../usuario/dtos/UsuarioLogadoDTO';
import { MesaListagemResultadoDTO } from './dtos/MesaListagemResultadoDTO';
import { MesaListagemParametrosDTO } from './dtos/MesaListagemParametrosDTO';
import { MesaListagemDTO } from './dtos/MesaListagemDTO';
import { MesaConsultaDTO } from './dtos/MesaConsultaDTO';
import { RequestError } from '../../utils/RequestError';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { MesaCadastroDTO } from './dtos/MesaCadastroDTO';
import { Mesa } from '../../models/Mesa';
import { Usuario } from '../../models/Usuario';
import { Empresa } from '../../models/Empresa';
import { MesaCadastroRetornoDTO } from './dtos/MesaCadastroRetornoDTO';
import { MesaAtualizacaoDTO } from './dtos/MesaAtualizacaoDTO';
import { MesaAtualizacaoRetornoDTO } from './dtos/MesaAtualizacaoRetornoDTO';
import { defaultParams } from '../../utils/params';

export class MesaService {

  async listar(mesaListagemParametrosDTO: MesaListagemParametrosDTO, usuarioLogado: UsuarioLogadoDTO): Promise<MesaListagemResultadoDTO> {
    const parametros: MesaListagemParametrosDTO = defaultParams(mesaListagemParametrosDTO, usuarioLogado);

    const [mesasModel, total] = await mesaRepository.listar(parametros);

    const mesasListagemDTO: MesaListagemDTO[] = [];

    for (let i = 0; i < mesasModel.length; i++) {
      const mesaModel = mesasModel[i];
      const mesaListagemDTO: MesaListagemDTO = {};

      mesaListagemDTO.id = mesaModel.id;
      mesaListagemDTO.numero = mesaModel.numero;
      mesaListagemDTO.descricao = mesaModel.descricao;

      mesasListagemDTO.push(mesaListagemDTO);
    }

    return { data: mesasListagemDTO, total };
  }

  async buscarPorId(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<MesaConsultaDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Código da mesa não informado');
    }

    const mesaModel = await mesaRepository.buscarPorId(id);

    if (!mesaModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Mesa não encontrada');
    }

    if (mesaModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Mesa não pertence a empresa do usuário');
    }

    const mesaConsultaDTO: MesaConsultaDTO = {};

    mesaConsultaDTO.numero = mesaModel.numero;
    mesaConsultaDTO.descricao = mesaModel.descricao;

    return mesaConsultaDTO;
  }

  async cadastrar(mesaCadastroDTO: MesaCadastroDTO, usuarioLogado: UsuarioLogadoDTO): Promise<MesaCadastroRetornoDTO> {
    const { numero, descricao } = mesaCadastroDTO;

    if (!isValidNumber(numero, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Número da mesa inválido');
    }

    if (!isValidString(descricao, { maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Descrição da mesa inválida');
    }

    const mesaModel = new Mesa();

    mesaModel.numero = Number(numero);
    mesaModel.descricao = descricao.trim();
    mesaModel.dataCadastro = new Date();
    mesaModel.usuarioCadastrou = new Usuario(usuarioLogado.id);
    mesaModel.empresa = new Empresa(usuarioLogado.empresa.id);

    const mesaComNumero = await mesaRepository.buscarPorNumero(mesaModel);

    if (mesaComNumero) {
      throw new RequestError(HttpStatusCode.UNPROCESSABLE_ENTITY, `Nº da mesa já cadastrado em "${mesaComNumero.descricao}"`);
    }

    const mesaSalva = await mesaRepository.salvar(mesaModel);

    const mesaCadastroRetornoDTO: MesaCadastroRetornoDTO = {};

    mesaCadastroRetornoDTO.id = mesaSalva.id;
    mesaCadastroRetornoDTO.numero = mesaSalva.numero;
    mesaCadastroRetornoDTO.dataCadastro = mesaModel.dataCadastro;

    return mesaCadastroRetornoDTO;
  }

  async atualizar(mesaAtualizacaoDTO: MesaAtualizacaoDTO, usuarioLogado: UsuarioLogadoDTO): Promise<MesaAtualizacaoRetornoDTO> {
    const { id, descricao } = mesaAtualizacaoDTO;

    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Código da mesa não informado');
    }

    if (!isValidString(descricao, { maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Descrição da mesa inválida');
    }

    const mesaModel = await mesaRepository.buscarPorId(id);

    if (!mesaModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Mesa não encontrada');
    }

    mesaModel.descricao = descricao.trim();
    mesaModel.dataAlteracao = new Date();
    mesaModel.usuarioAlterou = new Usuario(usuarioLogado.id);

    const mesaSalva = await mesaRepository.salvar(mesaModel);

    const mesaAtualizacaoRetornoDTO: MesaAtualizacaoRetornoDTO = {};

    mesaAtualizacaoRetornoDTO.numero = mesaSalva.numero;
    mesaAtualizacaoRetornoDTO.dataAlteracao = mesaSalva.dataAlteracao;

    return mesaAtualizacaoRetornoDTO;
  }

  async inativar(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<MesaAtualizacaoRetornoDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Código da mesa não informado');
    }

    const mesaModel = await mesaRepository.buscarPorId(id);

    if (!mesaModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Mesa não encontrada');
    }

    if (mesaModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Mesa não pertence a empresa do usuário');
    }

    mesaModel.ativo = false;
    mesaModel.dataAlteracao = new Date();
    mesaModel.usuarioAlterou = new Usuario(usuarioLogado.id);

    const mesaSalva = await mesaRepository.salvar(mesaModel);

    const mesaAtualizacaoRetornoDTO: MesaAtualizacaoRetornoDTO = {};

    mesaAtualizacaoRetornoDTO.numero = mesaSalva.numero;
    mesaAtualizacaoRetornoDTO.dataAlteracao = mesaSalva.dataAlteracao;

    return mesaAtualizacaoRetornoDTO;
  }
}