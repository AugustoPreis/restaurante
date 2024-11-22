import { empresaRepository } from '.';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { RequestError } from '../../utils/RequestError';
import { isValidNumber, isValidString } from '../../utils/validators';
import { UsuarioLogadoDTO } from '../usuario/dtos/UsuarioLogadoDTO';
import { EmpresaAtualizacaoDTO } from './dtos/EmpresaAtualizacaoDTO';
import { EmpresaAtualizacaoRetornoDTO } from './dtos/EmpresaAtualizacaoRetornoDTO';
import { EmpresaConsultaDTO } from './dtos/EmpresaConsultaDTO';

export class EmpresaService {

  async buscarPorId(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<EmpresaConsultaDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Código da empresa não informado');
    }

    const empresaModel = await empresaRepository.buscarPorId(id);

    if (!empresaModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Empresa não encontrada');
    }

    //temporario, até quando usuários puderem cadastrar empresas
    if (empresaModel.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Empresa diferente da pertencente ao usuário');
    }

    const empresaConsultaDTO: EmpresaConsultaDTO = {};

    empresaConsultaDTO.razaoSocial = empresaModel.razaoSocial;
    empresaConsultaDTO.nomeFantasia = empresaModel.nomeFantasia;
    empresaConsultaDTO.cnpj = empresaModel.cnpj;
    empresaConsultaDTO.estoqueNegativo = empresaModel.estoqueNegativo;

    return empresaConsultaDTO;
  }

  async atualizar(empresaAtualizacaoDTO: EmpresaAtualizacaoDTO, usuarioLogado: UsuarioLogadoDTO): Promise<EmpresaAtualizacaoRetornoDTO> {
    const { id, razaoSocial, nomeFantasia, cnpj, estoqueNegativo } = empresaAtualizacaoDTO;

    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Código da empresa não informado');
    }

    if (!isValidString(razaoSocial, { minLength: 1, maxLength: 150 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Razão social da empresa inválida');
    }

    if (!isValidString(nomeFantasia, { minLength: 1, maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Nome fantasia da empresa inválido');
    }

    if (!isValidString(cnpj, { length: 14 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'CNPJ da empresa inválido');
    }

    if (!usuarioLogado.admin) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Apenas admins podem alterar a empresa');
    }

    const empresaModel = await empresaRepository.buscarPorId(id);

    if (!empresaModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Empresa não encontrada');
    }

    if (empresaModel.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Empresa diferente da pertencente ao usuário');
    }

    empresaModel.razaoSocial = razaoSocial.trim();
    empresaModel.nomeFantasia = nomeFantasia.trim();
    empresaModel.cnpj = cnpj.trim();
    empresaModel.estoqueNegativo = !!estoqueNegativo;

    await empresaRepository.salvar(empresaModel);

    const empresaAtualizacaoRetornoDTO: EmpresaAtualizacaoRetornoDTO = {};

    empresaAtualizacaoRetornoDTO.dataAlteracao = new Date();

    return empresaAtualizacaoRetornoDTO;
  }
}