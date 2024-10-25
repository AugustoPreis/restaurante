import { QueryRunner } from 'typeorm';
import { UsuarioLogadoDTO } from '../usuario/dtos/UsuarioLogadoDTO';
import { PedidoAlteracao } from '../../models/PedidoAlteracao';
import { isValidNumber, isValidString } from '../../utils/validators';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { RequestError } from '../../utils/RequestError';
import { Pedido } from '../../models/Pedido';
import { Usuario } from '../../models/Usuario';
import { Empresa } from '../../models/Empresa';
import { pedidoAlteracaoRepository } from '.';
import { PedidoAlteracaoCadastroRetornoDTO } from './dtos/PedidoAlteracaoCadastroRetornoDTO';
import { PedidoAlteracaoCadastroDTO } from './dtos/PedidoAlteracaoCadastroDTO';

export class PedidoAlteracaoService {

  async cadastrar(pedidoAlteracaoCadastroDTO: PedidoAlteracaoCadastroDTO, usuarioLogado: UsuarioLogadoDTO, qr?: QueryRunner): Promise<PedidoAlteracaoCadastroRetornoDTO> {
    const { pedidoId, tipo } = pedidoAlteracaoCadastroDTO;

    if (!isValidNumber(pedidoId, { min: 1 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Pedido do log de alteraçao não informado');
    }

    const pedidoAlteracaoModel = new PedidoAlteracao();

    pedidoAlteracaoModel.pedido = new Pedido(pedidoId);
    pedidoAlteracaoModel.dataCadastro = new Date();
    pedidoAlteracaoModel.usuarioCadastrou = new Usuario(usuarioLogado.id);
    pedidoAlteracaoModel.empresa = new Empresa(usuarioLogado.empresa.id);

    if (isValidString(tipo)) {
      pedidoAlteracaoModel.tipo = tipo.trim();
    }

    const pedidoAlteracaoSalvo = await pedidoAlteracaoRepository.salvar(pedidoAlteracaoModel, qr);

    const pedidoAlteracaoCadastroRetornoDTO: PedidoAlteracaoCadastroRetornoDTO = {}

    pedidoAlteracaoCadastroRetornoDTO.id = pedidoAlteracaoSalvo.id;
    pedidoAlteracaoCadastroRetornoDTO.dataCadastro = pedidoAlteracaoSalvo.dataCadastro;

    return pedidoAlteracaoCadastroRetornoDTO;
  }
}