import { formaPagamentoRepository } from '.';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { defaultParams } from '../../utils/params';
import { RequestError } from '../../utils/RequestError';
import { isValidNumber } from '../../utils/validators';
import { UsuarioLogadoDTO } from '../usuario/dtos/UsuarioLogadoDTO';
import { FormaPagamentoConsultaDTO } from './dtos/FormaPagamentoConsultaDTO';
import { FormaPagamentoListagemDTO } from './dtos/FormaPagamentoListagemDTO';
import { FormaPagamentoListagemParametrosDTO } from './dtos/FormaPagamentoListagemParametrosDTO';
import { FormaPagamentoListagemResultadoDTO } from './dtos/FormaPagamentoListagemRetorno';

export class FormaPagamentoService {

  async listar(formaPagamentoListagemDTO: FormaPagamentoListagemParametrosDTO, usuarioLogado: UsuarioLogadoDTO): Promise<FormaPagamentoListagemResultadoDTO> {
    const parametros = defaultParams(formaPagamentoListagemDTO, usuarioLogado);

    const [formasPagamentoModel, total] = await formaPagamentoRepository.listar(parametros.filtro);

    const formasPagamentoListagemDTO: FormaPagamentoListagemDTO[] = [];

    for (let i = 0; i < formasPagamentoModel.length; i++) {
      const formaPagamentoModel = formasPagamentoModel[i];
      const formaPagamentoListagemDTO: FormaPagamentoListagemDTO = {};

      formaPagamentoListagemDTO.id = formaPagamentoModel.id;
      formaPagamentoListagemDTO.descricao = formaPagamentoModel.descricao;

      formasPagamentoListagemDTO.push(formaPagamentoListagemDTO);
    }

    return { data: formasPagamentoListagemDTO, total };
  }

  async buscarPorId(id: number): Promise<FormaPagamentoConsultaDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID da forma de pagamento inválido');
    }

    const formaPagamentoModel = await formaPagamentoRepository.buscarPorId(id);

    if (!formaPagamentoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Forma de pagamento não encontrada');
    }

    const formaPagamentoConsultaDTO: FormaPagamentoConsultaDTO = {};

    formaPagamentoConsultaDTO.descricao = formaPagamentoModel.descricao;

    return formaPagamentoConsultaDTO;
  }
}