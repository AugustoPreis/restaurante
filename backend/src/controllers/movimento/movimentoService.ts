import { movimentoRepository } from '.';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { Movimento } from '../../models/Movimento';
import { PedidoItem } from '../../models/PedidoItem';
import { Usuario } from '../../models/Usuario';
import { defaultParams } from '../../utils/params';
import { RequestError } from '../../utils/RequestError';
import { isValidDate, isValidNumber, isValidString } from '../../utils/validators';
import { empresaRepository } from '../empresa';
import { funcaoRepository } from '../funcao';
import { produtoRepository } from '../produto';
import { UsuarioLogadoDTO } from '../usuario/dtos/UsuarioLogadoDTO';
import { MovimentoCadastroDTO } from './dto/MovimentoCadastroDTO';
import { MovimentoListagemDTO } from './dto/MovimentoListagemDTO';
import { MovimentoListagemParametrosDTO } from './dto/MovimentoListagemParametrosDTO';
import { MovimentoListagemResultadoDTO } from './dto/MovimentoListagemResultadoDTO';
import { MovimentoResultadoDTO } from './dto/MovimentoResultadoDTO';

export class MovimentoService {

  async listarPorProduto(movimentoListagemParametrosDTO: MovimentoListagemParametrosDTO, usuarioLogado: UsuarioLogadoDTO): Promise<MovimentoListagemResultadoDTO> {
    const parametros = defaultParams<MovimentoListagemParametrosDTO>(movimentoListagemParametrosDTO, usuarioLogado);

    const [movimentosModel, total] = await movimentoRepository.listarPorProduto(parametros);

    const movimentosListagemDTO: MovimentoListagemDTO[] = [];

    for (let i = 0; i < movimentosModel.length; i++) {
      const movimentoModel = movimentosModel[i];

      const movimentoListagemDTO: MovimentoListagemDTO = {};

      movimentoListagemDTO.id = movimentoModel.id;
      movimentoListagemDTO.tipo = movimentoModel.tipo;
      movimentoListagemDTO.quantidade = movimentoModel.quantidade;
      movimentoListagemDTO.estoque = movimentoModel.estoque;
      movimentoListagemDTO.descricao = movimentoModel.descricao;
      movimentoListagemDTO.dataMovimento = movimentoModel.dataMovimento;
      movimentoListagemDTO.dataCadastro = movimentoModel.dataCadastro;

      movimentosListagemDTO.push(movimentoListagemDTO);
    }

    return { data: movimentosListagemDTO, total };
  }

  async cadastrar(movimentoCadastroDTO: MovimentoCadastroDTO, usuarioLogado: UsuarioLogadoDTO): Promise<MovimentoResultadoDTO> {
    const { produtoId, quantidade, dataMovimento, tipo, descricao, pedidoItemId } = movimentoCadastroDTO;

    if (!isValidNumber(produtoId, { allowString: true })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do produto não informado');
    }

    if (!isValidNumber(quantidade, { allowString: true, min: 0.01 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Quantidade não informada');
    }

    if (!['E', 'S'].includes(tipo)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Tipo do movimento não informado');
    }

    const movimentoModel = new Movimento();

    movimentoModel.produto = await produtoRepository.buscarPorId(produtoId);
    movimentoModel.quantidade = Number(quantidade);
    movimentoModel.tipo = tipo;
    movimentoModel.estoque = await funcaoRepository.estoqueAtual(produtoId);
    movimentoModel.dataMovimento = new Date();
    movimentoModel.dataCadastro = new Date();
    movimentoModel.usuarioCadastrou = new Usuario(usuarioLogado.id);
    movimentoModel.empresa = await empresaRepository.buscarPorId(usuarioLogado.empresa.id);

    switch (movimentoModel.tipo) {
      case 'E':
        movimentoModel.estoque += movimentoModel.quantidade;
        break;
      case 'S':
        movimentoModel.estoque -= movimentoModel.quantidade;

        if (isValidNumber(pedidoItemId)) {
          movimentoModel.pedidoItem = new PedidoItem(pedidoItemId);
        }
        break;
    }

    if (!movimentoModel.produto.movimentaEstoque) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, `O produto "${movimentoModel.produto.nome}" não movimenta estoque`);
    }

    if (!movimentoModel.empresa.estoqueNegativo && movimentoModel.estoque < 0) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, `O estoque do produto "${movimentoModel.produto.nome}" não pode ser negativo`);
    }

    if (isValidString(descricao, { maxLength: 100 })) {
      movimentoModel.descricao = descricao.trim();
    }

    if (isValidDate(dataMovimento, { allowString: true })) {
      movimentoModel.dataMovimento = new Date(dataMovimento);
    }

    const movimentoSalvo = await movimentoRepository.salvar(movimentoModel);

    const movimentoResultadoDTO: MovimentoResultadoDTO = {};

    movimentoResultadoDTO.id = movimentoSalvo.id;
    movimentoResultadoDTO.estoque = movimentoSalvo.estoque;
    movimentoResultadoDTO.dataCadastro = movimentoSalvo.dataCadastro;

    return movimentoResultadoDTO;
  }
}