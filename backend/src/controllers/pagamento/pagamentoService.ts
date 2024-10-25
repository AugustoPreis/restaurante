import { pagamentoRepository } from '.';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { Empresa } from '../../models/Empresa';
import { FormaPagamento } from '../../models/FormaPagamento';
import { Pagamento } from '../../models/Pagamento';
import { Pedido } from '../../models/Pedido';
import { Usuario } from '../../models/Usuario';
import { RequestError } from '../../utils/RequestError';
import { isValidNumber } from '../../utils/validators';
import { formaPagamentoService } from '../formaPagamento';
import { funcaoRepository } from '../funcao';
import { UsuarioLogadoDTO } from '../usuario/dtos/UsuarioLogadoDTO';
import { PagamentoAlteracaoRetornoDTO } from './dtos/PagamentoAlteracaoRetornoDTO';
import { PagamentoBuscarParametrosDTO } from './dtos/PagamentoBuscarParametrosDTO';
import { PagamentoBuscarResultadoDTO } from './dtos/PagamentoBuscarResultadoDTO';
import { PagamentoCadastroDTO } from './dtos/PagamentoCadastroDTO';
import { PagamentoCadastroRetornoDTO } from './dtos/PagamentoCadastroRetornoDTO';
import { PagamentoListagemDTO } from './dtos/PagamentoListagemDTO';

export class PagamentoService {

  async buscarPorComandaPedido(pagamentoBuscarParametrosDTO: PagamentoBuscarParametrosDTO, usuarioLogado: UsuarioLogadoDTO): Promise<PagamentoBuscarResultadoDTO> {
    const { comanda, pedidoId } = pagamentoBuscarParametrosDTO;

    if (!isValidNumber(pedidoId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do pedido inválido');
    }

    if (!isValidNumber(comanda, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Comanda inválida');
    }

    const pagamentosModel = await pagamentoRepository.buscarPorComandaPedido(comanda, pedidoId);

    const pagamentoBuscarResultadoDTO: PagamentoBuscarResultadoDTO = {};

    pagamentoBuscarResultadoDTO.valorComanda = await funcaoRepository.valorPedido(pedidoId, comanda);
    pagamentoBuscarResultadoDTO.valorPago = await funcaoRepository.valorPagoPedido(pedidoId, comanda);
    pagamentoBuscarResultadoDTO.valorRestante = pagamentoBuscarResultadoDTO.valorComanda - pagamentoBuscarResultadoDTO.valorPago;
    pagamentoBuscarResultadoDTO.pagamentos = [];

    for (let i = 0; i < pagamentosModel.length; i++) {
      const pagamentoModel = pagamentosModel[i];

      if (pagamentoModel.empresa.id !== usuarioLogado.empresa.id) {
        throw new RequestError(HttpStatusCode.FORBIDDEN, 'O pagamento não pertence a empresa do usuário logado');
      }

      const pagamentoListagemDTO: PagamentoListagemDTO = {};

      pagamentoListagemDTO.id = pagamentoModel.id;
      pagamentoListagemDTO.valor = pagamentoModel.valor;
      pagamentoListagemDTO.dataCadastro = pagamentoModel.dataCadastro;
      pagamentoListagemDTO.formaPagamento = await formaPagamentoService.buscarPorId(pagamentoModel.formaPagamento.id);
      pagamentoListagemDTO.formaPagamento.id = pagamentoModel.formaPagamento.id;

      pagamentoBuscarResultadoDTO.pagamentos.push(pagamentoListagemDTO);
    }

    return pagamentoBuscarResultadoDTO;
  }

  async cadastrar(pagamentoCadastroDTO: PagamentoCadastroDTO, usuarioLogado: UsuarioLogadoDTO): Promise<PagamentoCadastroRetornoDTO> {
    const { pedidoId, comanda, formaPagamentoId, valor } = pagamentoCadastroDTO;

    if (!isValidNumber(pedidoId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do pedido inválido');
    }

    if (!isValidNumber(comanda, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Comanda inválida');
    }

    if (!isValidNumber(formaPagamentoId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID da forma de pagamento inválido');
    }

    if (!isValidNumber(valor, { min: 0.01 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Valor inválido');
    }

    const valorPedido = await funcaoRepository.valorPedido(pedidoId, comanda);
    const valorPagoPedido = await funcaoRepository.valorPagoPedido(pedidoId, comanda);

    if (valorPedido <= valorPagoPedido) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, `Comanda Nº${comanda} já foi paga`);
    }

    const valorRestante = valorPedido - valorPagoPedido - valor;

    if (valorRestante < 0) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, `Valor do pagamento excede o valor restante da comanda Nº${comanda}`);
    }

    const pagamentoModel = new Pagamento();

    pagamentoModel.pedido = new Pedido(pedidoId);
    pagamentoModel.formaPagamento = new FormaPagamento(formaPagamentoId);
    pagamentoModel.comanda = comanda;
    pagamentoModel.valor = valor;
    pagamentoModel.dataCadastro = new Date();
    pagamentoModel.usuarioCadastrou = new Usuario(usuarioLogado.id);
    pagamentoModel.empresa = new Empresa(usuarioLogado.empresa.id);

    const pagamentoSalvo = await pagamentoRepository.salvar(pagamentoModel);

    const pagamentoCadastroRetornoDTO: PagamentoCadastroRetornoDTO = {};

    pagamentoCadastroRetornoDTO.id = pagamentoSalvo.id;
    pagamentoCadastroRetornoDTO.valorRestante = valorRestante;

    return pagamentoCadastroRetornoDTO;
  }

  async inativar(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<PagamentoAlteracaoRetornoDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do pagamento inválido');
    }

    const pagamentoModel = await pagamentoRepository.buscarPorId(id);

    if (!pagamentoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Pagamento não encontrado');
    }

    if (pagamentoModel.empresa.id !== usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'O pagamento não pertence a empresa do usuário logado');
    }

    pagamentoModel.ativo = false;
    pagamentoModel.dataAlteracao = new Date();
    pagamentoModel.usuarioAlterou = new Usuario(usuarioLogado.id);

    const pagamentoSalvo = await pagamentoRepository.salvar(pagamentoModel);

    const pagamentoAlteracaoRetornoDTO: PagamentoAlteracaoRetornoDTO = {};

    pagamentoAlteracaoRetornoDTO.ativo = pagamentoSalvo.ativo;
    pagamentoAlteracaoRetornoDTO.dataAlteracao = pagamentoSalvo.dataAlteracao;

    return pagamentoAlteracaoRetornoDTO;
  }
}