import { QueryRunner } from 'typeorm';
import { pedidoItemRepository } from '.';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { Empresa } from '../../models/Empresa';
import { Pedido } from '../../models/Pedido';
import { PedidoItem } from '../../models/PedidoItem';
import { Usuario } from '../../models/Usuario';
import { RequestError } from '../../utils/RequestError';
import { isValidNumber } from '../../utils/validators';
import { UsuarioLogadoDTO } from '../usuario/dtos/UsuarioLogadoDTO';
import { PedidoItemCadastroDTO } from './dtos/PedidoItemCadastroDTO';
import { PedidoItemCadastroRetornoDTO } from './dtos/PedidoItemCadastroRetornoDTO';
import { PedidoItemConsultaDTO } from './dtos/PedidoItemConsultaDTO';
import { produtoRepository, produtoService } from '../produto';
import { PedidoItemAtualizacaoDTO } from './dtos/PedidoItemAtualizacaoDTO';
import { PedidoItemInativarParametrosDTO } from './dtos/PedidoItemInativarParametrosDTO';
import { PedidoItemAtualizacaoRetornoDTO } from './dtos/PedidoItemAtualizacaoRetornoDTO';
import { movimentoService } from '../movimento';

export class PedidoItemService {

  async buscarPorPedido(pedidoId: number, usuarioLogado: UsuarioLogadoDTO): Promise<PedidoItemConsultaDTO[]> {
    if (!isValidNumber(pedidoId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Pedido não informado');
    }

    const pedidoItensModel = await pedidoItemRepository.buscarPorPedido(pedidoId);

    const pedidoItensConsultaDTO: PedidoItemConsultaDTO[] = [];

    if (!Array.isArray(pedidoItensModel) || !pedidoItensModel.length) {
      return pedidoItensConsultaDTO;
    }

    for (let i = 0; i < pedidoItensModel.length; i++) {
      const pedidoItemModel = pedidoItensModel[i];

      const pedidoItemConsultaDTO: PedidoItemConsultaDTO = {};

      pedidoItemConsultaDTO.id = pedidoItemModel.id;
      pedidoItemConsultaDTO.comanda = pedidoItemModel.comanda;
      pedidoItemConsultaDTO.quantidade = pedidoItemModel.quantidade;
      pedidoItemConsultaDTO.valor = pedidoItemModel.valor;
      pedidoItemConsultaDTO.produto = await produtoService.buscarPorId(pedidoItemModel.produto.id, usuarioLogado);
      pedidoItemConsultaDTO.produto.id = pedidoItemModel.produto.id;

      pedidoItensConsultaDTO.push(pedidoItemConsultaDTO);
    }

    return pedidoItensConsultaDTO;
  }

  async cadastrarPorPedido(pedidoItensCadastroDTO: PedidoItemCadastroDTO[], pedidoId: number, usuarioLogado: UsuarioLogadoDTO, qr?: QueryRunner): Promise<PedidoItemCadastroRetornoDTO[]> {
    const pedidoItemCadastrosRetornoDTO: PedidoItemCadastroRetornoDTO[] = [];

    for (let i = 0; i < pedidoItensCadastroDTO.length; i++) {
      const item = pedidoItensCadastroDTO[i];

      item.pedidoId = pedidoId;

      const pedidoCadastroItemRetornoDTO = await this.cadastrar(item, usuarioLogado, qr);

      pedidoItemCadastrosRetornoDTO.push(pedidoCadastroItemRetornoDTO);
    }

    return pedidoItemCadastrosRetornoDTO;
  }

  async atualizarPorPedido(pedidoItensAtualizacaoDTO: PedidoItemAtualizacaoDTO[], pedidoId: number, usuarioLogado: UsuarioLogadoDTO, qr?: QueryRunner): Promise<PedidoItemAtualizacaoRetornoDTO[]> {
    const pedidoItensAtualizacaoRetornoDTO: PedidoItemAtualizacaoRetornoDTO[] = [];
    const idItens: number[] = [];

    for (let i = 0; i < pedidoItensAtualizacaoDTO.length; i++) {
      const item = pedidoItensAtualizacaoDTO[i];

      //atualizacao de item não implementada
      if (item.id) {
        idItens.push(item.id);

        continue;
      }

      item.pedidoId = pedidoId;

      const pedidoCadastroItemRetornoDTO = await this.cadastrar(item, usuarioLogado, qr);

      idItens.push(pedidoCadastroItemRetornoDTO.id);

      const pedidoItemAtualizacaoRetornoDTO: PedidoItemAtualizacaoRetornoDTO = {};

      pedidoItemAtualizacaoRetornoDTO.id = pedidoCadastroItemRetornoDTO.id;
      pedidoItemAtualizacaoRetornoDTO.dataAlteracao = null;
      pedidoItemAtualizacaoRetornoDTO.ativo = true;

      pedidoItensAtualizacaoRetornoDTO.push(pedidoCadastroItemRetornoDTO);
    }

    const pedidoItemInativadosRetornoDTO = await this.inativar({ ids: idItens, pedidoId }, usuarioLogado, qr);

    pedidoItensAtualizacaoRetornoDTO.push(...pedidoItemInativadosRetornoDTO);

    return pedidoItensAtualizacaoRetornoDTO;
  }

  async cadastrar(pedidoItemCadastroDTO: PedidoItemCadastroDTO, usuarioLogado: UsuarioLogadoDTO, qr?: QueryRunner): Promise<PedidoItemCadastroRetornoDTO> {
    const { pedidoId, comanda, produtoId, quantidade, valor } = pedidoItemCadastroDTO;

    if (!isValidNumber(pedidoId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Pedido do item não informado');
    }

    if (!isValidNumber(comanda, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Comanda do item não informada');
    }

    if (!isValidNumber(produtoId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Produto do item não informado');
    }

    if (!isValidNumber(quantidade, { min: 0.01, max: 999.99 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Quantidade do item não informada');
    }

    if (!isValidNumber(valor, { min: 0.01, max: 99999.99 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Valor do item não informado');
    }

    const pedidoItemModel = new PedidoItem();
    const produtoModel = await produtoRepository.buscarPorId(produtoId);

    pedidoItemModel.pedido = new Pedido(pedidoId);
    pedidoItemModel.comanda = comanda;
    pedidoItemModel.produto = produtoModel;
    pedidoItemModel.quantidade = quantidade;
    pedidoItemModel.valor = valor;
    pedidoItemModel.dataCadastro = new Date();
    pedidoItemModel.usuarioCadastrou = new Usuario(usuarioLogado.id);
    pedidoItemModel.empresa = new Empresa(usuarioLogado.empresa.id);

    const pedidoItemSalvo = await pedidoItemRepository.salvar(pedidoItemModel, qr);

    const pedidoItemCadastroRetornoDTO: PedidoItemCadastroRetornoDTO = {};

    pedidoItemCadastroRetornoDTO.id = pedidoItemSalvo.id;
    pedidoItemCadastroRetornoDTO.dataCadastro = pedidoItemSalvo.dataCadastro;

    if (produtoModel.movimentaEstoque) {
      pedidoItemCadastroRetornoDTO.movimentoEstoque = await movimentoService.cadastrar({
        dataMovimento: pedidoItemModel.dataCadastro,
        descricao: 'Cadastro de item no pedido',
        pedidoItemId: pedidoItemSalvo.id,
        quantidade: pedidoItemSalvo.quantidade,
        produtoId: produtoModel.id,
        tipo: 'S',
      }, usuarioLogado, qr);
    }

    return pedidoItemCadastroRetornoDTO;
  }

  async inativar(pedidoItemInativarParametrosDTO: PedidoItemInativarParametrosDTO, usuarioLogado: UsuarioLogadoDTO, qr: QueryRunner): Promise<PedidoItemAtualizacaoRetornoDTO[]> {
    const { ids, pedidoId } = pedidoItemInativarParametrosDTO;

    if (!isValidNumber(pedidoId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Pedido do item não informado');
    }

    const pedidoItensModel = await pedidoItemRepository.buscarParaInativacao(pedidoId, ids, qr);

    const pedidoItensAtualizacaoRetornoDTO: PedidoItemAtualizacaoRetornoDTO[] = [];

    if (!Array.isArray(pedidoItensModel) || !pedidoItensModel.length) {
      return pedidoItensAtualizacaoRetornoDTO;
    }

    for (let i = 0; i < pedidoItensModel.length; i++) {
      const pedidoItemModel = pedidoItensModel[i];

      pedidoItemModel.ativo = false;
      pedidoItemModel.dataAlteracao = new Date();
      pedidoItemModel.usuarioAlterou = new Usuario(usuarioLogado.id);

      const pedidoItemSalvo = await pedidoItemRepository.salvar(pedidoItemModel, qr);

      const pedidoItemAtualizacaoRetornoDTO: PedidoItemAtualizacaoRetornoDTO = {};

      pedidoItemAtualizacaoRetornoDTO.id = pedidoItemSalvo.id;
      pedidoItemAtualizacaoRetornoDTO.dataAlteracao = pedidoItemSalvo.dataAlteracao;

      if (pedidoItemModel.produto.movimentaEstoque) {
        pedidoItemAtualizacaoRetornoDTO.movimentoEstoque = await movimentoService.cadastrar({
          dataMovimento: pedidoItemModel.dataAlteracao,
          descricao: 'Inativação de item no pedido',
          pedidoItemId: pedidoItemSalvo.id,
          quantidade: pedidoItemSalvo.quantidade,
          produtoId: pedidoItemModel.produto.id,
          tipo: 'E',
        }, usuarioLogado, qr);
      }

      pedidoItensAtualizacaoRetornoDTO.push(pedidoItemAtualizacaoRetornoDTO);
    }

    return pedidoItensAtualizacaoRetornoDTO;
  }
}