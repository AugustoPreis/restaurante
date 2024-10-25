import { QueryRunner } from 'typeorm';
import { pedidoRepository } from '.';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { Empresa } from '../../models/Empresa';
import { Mesa } from '../../models/Mesa';
import { Pedido } from '../../models/Pedido';
import { Usuario } from '../../models/Usuario';
import { RequestError } from '../../utils/RequestError';
import { isValidNumber, isValidString } from '../../utils/validators';
import { UsuarioLogadoDTO } from '../usuario/dtos/UsuarioLogadoDTO';
import { PedidoCadastroDTO } from './dtos/PedidoCadastroDTO';
import { PedidoCadastroRetornoDTO } from './dtos/PedidoCadastroRetornoDTO';
import { commit, getQueryRunner, rollback } from '../../database';
import { pedidoItemService } from '../pedidoItem';
import { PedidoConsultaDTO } from './dtos/PedidoConsultaDTO';
import { mesaService } from '../mesa';
import { PedidoListagemParametrosDTO } from './dtos/PedidoListagemParametrosDTO';
import { PedidoListagemRetornoDTO } from './dtos/PedidoListagemResultadoDTO';
import { defaultParams } from '../../utils/params';
import { PedidoListagemDTO } from './dtos/PedidoListagemDTO';
import { funcaoRepository } from '../funcao';
import { PedidoAtualizacaoDTO } from './dtos/PedidoAtualizacaoDTO';
import { PedidoAtualizacaoRetornoDTO } from './dtos/PedidoAtualizacaoRetornoDTO';
import { pedidoAlteracaoService } from '../pedidoAlteracao';
import { PedidoDadosPagamentoDTO } from './dtos/PedidoDadosPagamentoDTO';
import { PedidoComandaDTO } from './dtos/PedidoComandaDTO';

export class PedidoService {

  async listar(pedidoListagemParametrosDTO: PedidoListagemParametrosDTO, usuarioLogadoDTO: UsuarioLogadoDTO): Promise<PedidoListagemRetornoDTO> {
    const parametros = defaultParams(pedidoListagemParametrosDTO, usuarioLogadoDTO);

    const [pedidosModel, total] = await pedidoRepository.listar(parametros);

    const pedidosListagemDTO: PedidoListagemDTO[] = [];

    for (let i = 0; i < pedidosModel.length; i++) {
      const pedidoModel = pedidosModel[i];

      const pedidoListagemDTO: PedidoListagemDTO = {};

      pedidoListagemDTO.id = pedidoModel.id;
      pedidoListagemDTO.numero = pedidoModel.numero;
      pedidoListagemDTO.mesa = pedidoModel.mesa;
      pedidoListagemDTO.valor = await funcaoRepository.valorPedido(pedidoModel.id);
      pedidoListagemDTO.dataCadastro = pedidoModel.dataCadastro;

      pedidosListagemDTO.push(pedidoListagemDTO);
    }

    return { data: pedidosListagemDTO, total };
  }

  async buscarPorId(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<PedidoConsultaDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Pedido não informado');
    }

    const pedidoModel = await pedidoRepository.buscarPorId(id);

    if (!pedidoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Pedido não encontrado');
    }

    if (pedidoModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Pedido não pertence a empresa do usuário');
    }

    const pedidoConsultaDTO: PedidoConsultaDTO = {};

    pedidoConsultaDTO.mesa = await mesaService.buscarPorId(pedidoModel.mesa.id, usuarioLogado);
    pedidoConsultaDTO.mesa.id = pedidoModel.mesa.id;
    pedidoConsultaDTO.descricao = pedidoModel.descricao;
    pedidoConsultaDTO.itens = await pedidoItemService.buscarPorPedido(pedidoModel.id, usuarioLogado);

    return pedidoConsultaDTO;
  }

  async buscarDadosPagamento(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<PedidoDadosPagamentoDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Pedido não informado');
    }

    const pedidoModel = await pedidoRepository.buscarPorId(id);

    if (!pedidoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Pedido não encontrado');
    }

    if (pedidoModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Pedido não pertence a empresa do usuário');
    }

    const pedidoDadosPagamentoDTO: PedidoDadosPagamentoDTO = {};
    const pedidoItensConsultaDTO = await pedidoItemService.buscarPorPedido(pedidoModel.id, usuarioLogado);

    pedidoDadosPagamentoDTO.valor = await funcaoRepository.valorPedido(pedidoModel.id);
    pedidoDadosPagamentoDTO.valorPago = await funcaoRepository.valorPagoPedido(pedidoModel.id);
    pedidoDadosPagamentoDTO.comandas = [];

    for (let i = 0; i < pedidoItensConsultaDTO.length; i++) {
      const pedidoItemConsultaDTO = pedidoItensConsultaDTO[i];
      let index = pedidoDadosPagamentoDTO.comandas.findIndex((comanda) => comanda.numero === pedidoItemConsultaDTO.comanda);

      if (index === -1) {
        index = pedidoDadosPagamentoDTO.comandas.length;

        const pedidoComandaDTO: PedidoComandaDTO = {};

        pedidoComandaDTO.numero = pedidoItemConsultaDTO.comanda;
        pedidoComandaDTO.valor = await funcaoRepository.valorPedido(pedidoModel.id, pedidoItemConsultaDTO.comanda);
        pedidoComandaDTO.valorPago = await funcaoRepository.valorPagoPedido(pedidoModel.id, pedidoItemConsultaDTO.comanda);
        pedidoComandaDTO.itens = [];

        pedidoDadosPagamentoDTO.comandas.push(pedidoComandaDTO);
      }

      pedidoDadosPagamentoDTO.comandas[index].itens.push(pedidoItemConsultaDTO);
    }

    pedidoDadosPagamentoDTO.comandas = pedidoDadosPagamentoDTO.comandas.sort((a, b) => a.numero - b.numero);

    return pedidoDadosPagamentoDTO;
  }

  async cadastrar(pedidoCadastroDTO: PedidoCadastroDTO, usuarioLogado: UsuarioLogadoDTO): Promise<PedidoCadastroRetornoDTO> {
    const { mesaId, descricao, itens } = pedidoCadastroDTO;

    if (!isValidNumber(mesaId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Mesa do pedido não informada');
    }

    const pedidoModel = new Pedido();

    pedidoModel.mesa = new Mesa(mesaId);
    pedidoModel.dataCadastro = new Date();
    pedidoModel.usuarioCadastrou = new Usuario(usuarioLogado.id);
    pedidoModel.empresa = new Empresa(usuarioLogado.empresa.id);
    pedidoModel.numero = await pedidoRepository.proximoNumero(pedidoModel);

    if (isValidString(descricao)) {
      pedidoModel.descricao = descricao.trim();
    }

    const pedidoComMesa = await pedidoRepository.buscarPorMesa(pedidoModel.mesa.id);

    if (pedidoComMesa) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Já existe um pedido aberto para a mesa informada');
    }

    let qr: QueryRunner;

    try {
      qr = await getQueryRunner();

      const pedidoSalvo = await pedidoRepository.salvar(pedidoModel, qr);

      const pedidoCadastroRetornoDTO: PedidoCadastroRetornoDTO = {};

      pedidoCadastroRetornoDTO.id = pedidoSalvo.id;
      pedidoCadastroRetornoDTO.numero = pedidoSalvo.numero;
      pedidoCadastroRetornoDTO.dataCadastro = pedidoSalvo.dataCadastro;

      if (Array.isArray(itens) && itens.length) {
        pedidoCadastroRetornoDTO.itens = await pedidoItemService.cadastrarPorPedido(itens, pedidoSalvo.id, usuarioLogado, qr);
      }

      await commit(qr);

      return pedidoCadastroRetornoDTO;
    } catch (err) {
      await rollback(qr);

      throw err;
    }
  }

  async atualizar(pedidoAtualizacaoDTO: PedidoAtualizacaoDTO, usuarioLogado: UsuarioLogadoDTO): Promise<PedidoAtualizacaoRetornoDTO> {
    const { id, mesaId, descricao, itens } = pedidoAtualizacaoDTO;

    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do pedido não informado');
    }

    if (!isValidNumber(mesaId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Mesa do pedido não informada');
    }

    const pedidoModel = await pedidoRepository.buscarPorId(id);

    if (!pedidoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Pedido não encontrado');
    }

    if (pedidoModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Pedido não pertence a empresa do usuário');
    }

    if (pedidoModel.mesa.id != mesaId) {
      const pedidoComMesa = await pedidoRepository.buscarPorMesa(mesaId);

      if (pedidoComMesa) {
        throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Já existe um pedido aberto para a mesa informada');
      }

      pedidoModel.mesa = new Mesa(mesaId);
    }

    if (isValidString(descricao)) {
      pedidoModel.descricao = descricao.trim();
    }

    let qr: QueryRunner;

    try {
      qr = await getQueryRunner();

      const pedidoSalvo = await pedidoRepository.salvar(pedidoModel, qr);
      const pedidoItensAtualizacaoRetornoDTO = await pedidoItemService.atualizarPorPedido(itens, pedidoSalvo.id, usuarioLogado, qr);
      const pedidoAlteracaoCadastroRetornoDTO = await pedidoAlteracaoService.cadastrar(pedidoSalvo.id, usuarioLogado, qr);

      const pedidoAtualizacaoRetornoDTO: PedidoAtualizacaoRetornoDTO = {};

      pedidoAtualizacaoRetornoDTO.dataAlteracao = pedidoAlteracaoCadastroRetornoDTO.dataCadastro;
      pedidoAtualizacaoRetornoDTO.itens = pedidoItensAtualizacaoRetornoDTO;

      await commit(qr);

      return pedidoAtualizacaoRetornoDTO;
    } catch (err) {
      await rollback(qr);

      throw err;
    }
  }

  async fechar(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<PedidoAtualizacaoRetornoDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do pedido não informado');
    }

    const pedidoModel = await pedidoRepository.buscarPorId(id);

    if (!pedidoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Pedido não encontrado');
    }

    if (pedidoModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Pedido não pertence a empresa do usuário');
    }

    let qr: QueryRunner;

    try {
      qr = await getQueryRunner();

      pedidoModel.fechado = true;

      const pedidoSalvo = await pedidoRepository.salvar(pedidoModel);
      const pedidoAlteracaoCadastroRetornoDTO = await pedidoAlteracaoService.cadastrar(pedidoSalvo.id, usuarioLogado, qr);

      const pedidoAtualizacaoRetornoDTO: PedidoAtualizacaoRetornoDTO = {};

      pedidoAtualizacaoRetornoDTO.dataAlteracao = pedidoAlteracaoCadastroRetornoDTO.dataCadastro;
      pedidoAtualizacaoRetornoDTO.itens = [];

      await commit(qr);

      return pedidoAtualizacaoRetornoDTO;
    } catch (err) {
      await rollback(qr);

      throw err;
    }
  }

  async inativar(id: number, usuarioLogado: UsuarioLogadoDTO): Promise<PedidoAtualizacaoRetornoDTO> {
    if (!isValidNumber(id, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do pedido não informado');
    }

    const pedidoModel = await pedidoRepository.buscarPorId(id);

    if (!pedidoModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Pedido não encontrado');
    }

    if (pedidoModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Pedido não pertence a empresa do usuário');
    }

    let qr: QueryRunner;

    try {
      qr = await getQueryRunner();

      pedidoModel.ativo = false;

      const pedidoSalvo = await pedidoRepository.salvar(pedidoModel);
      const pedidoAlteracaoCadastroRetornoDTO = await pedidoAlteracaoService.cadastrar(pedidoSalvo.id, usuarioLogado, qr);

      const pedidoAtualizacaoRetornoDTO: PedidoAtualizacaoRetornoDTO = {};

      pedidoAtualizacaoRetornoDTO.dataAlteracao = pedidoAlteracaoCadastroRetornoDTO.dataCadastro;
      pedidoAtualizacaoRetornoDTO.itens = [];

      await commit(qr);

      return pedidoAtualizacaoRetornoDTO;
    } catch (err) {
      await rollback(qr);

      throw err;
    }
  }
}