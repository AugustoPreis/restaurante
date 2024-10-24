import { formaPagamentoRepository } from '.';
import { defaultParams } from '../../utils/params';
import { UsuarioLogadoDTO } from '../usuario/dtos/UsuarioLogadoDTO';
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
}