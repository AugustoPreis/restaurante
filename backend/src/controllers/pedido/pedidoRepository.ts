import { QueryRunner } from 'typeorm';
import { Database } from '../../database';
import { Pedido } from '../../models/Pedido';
import { PedidoListagemParametrosDTO } from './dtos/PedidoListagemParametrosDTO';
import { RelatorioImpressaoFiltroDTO } from '../relatorio/dtos/RelatorioImpressaoFiltroDTO';
import { PedidoAlteracao } from '../../models/PedidoAlteracao';

export class PedidoRepository {
  private readonly repository = Database.getRepository(Pedido);

  async listar(parametros: PedidoListagemParametrosDTO): Promise<[Pedido[], number]> {
    const qb = this.repository
      .createQueryBuilder('pedido')
      .innerJoinAndSelect('pedido.mesa', 'mesa')
      .where('pedido.empresa = :empresa', { empresa: parametros.idEmpresa })
      .andWhere('pedido.ativo IS TRUE')
      .andWhere('pedido.fechado IS FALSE')
      .andWhere(`mesa.descricao ILIKE '%'||:filtro||'%'`, { filtro: parametros.filtro })
      .orderBy('mesa.numero');

    const ascOrDesc = parametros.crescente ? 'ASC' : 'DESC';

    switch (parametros.ordem) {
      case 'mesa':
        qb.orderBy('mesa.numero', ascOrDesc);
        break;
      case 'valor':
        qb.orderBy('valor_pedido(pedido.id)', ascOrDesc);
        break;
    }

    return await qb.getManyAndCount();
  }

  async proximoNumero(pedido: Pedido): Promise<number> {
    return await this.repository
      .createQueryBuilder('pedido')
      .where('pedido.empresa = :empresa', { empresa: pedido.empresa.id })
      .getCount() + 1;
  }

  async buscarPorId(id: number, qr?: QueryRunner): Promise<Pedido> {
    return await this.repository
      .createQueryBuilder('pedido', qr)
      .innerJoinAndSelect('pedido.mesa', 'mesa')
      .innerJoinAndSelect('pedido.empresa', 'empresa')
      .where('pedido.id = :id', { id })
      .andWhere('pedido.ativo IS TRUE')
      .getOne();
  }

  async buscarPorMesa(mesaId: number): Promise<Pedido> {
    return await this.repository
      .createQueryBuilder('pedido')
      .where('pedido.mesa = :mesaId', { mesaId })
      .andWhere('pedido.fechado IS FALSE')
      .andWhere('pedido.ativo IS TRUE')
      .getOne();
  }

  async pedidosAbertos(parametros: RelatorioImpressaoFiltroDTO): Promise<Pedido[]> {
    return await this.repository
      .createQueryBuilder('pedido')
      .innerJoinAndSelect('pedido.mesa', 'mesa')
      .where('pedido.ativo IS TRUE')
      .andWhere('pedido.fechado IS FALSE')
      .andWhere('pedido.empresa = :empresa', { empresa: parametros.usuarioLogado.empresa.id })
      .orderBy('pedido.dataCadastro')
      .getMany();
  }

  async pedidosFechados(parametros: RelatorioImpressaoFiltroDTO): Promise<Pedido[]> {
    const qb = Database.getRepository(PedidoAlteracao)
      .createQueryBuilder('alt')
      .innerJoinAndSelect('alt.pedido', 'pedido')
      .innerJoinAndSelect('pedido.mesa', 'mesa')
      .where('pedido.ativo IS TRUE')
      .andWhere('pedido.fechado IS TRUE')
      .andWhere(`alt.tipo = 'FECHAMENTO'`)
      .andWhere('pedido.empresa = :empresa', { empresa: parametros.usuarioLogado.empresa.id });

    if (parametros.dataInicio && parametros.dataFim) {
      qb.andWhere(`
        date_trunc('day', alt.dataCadastro)
          BETWEEN
        date_trunc('day', :dataInicio::timestamp)
          AND
        date_trunc('day', :dataFim::timestamp)
      `, {
        dataInicio: parametros.dataInicio,
        dataFim: parametros.dataFim,
      });
    }

    const pedidosAlteracao = await qb
      .orderBy('alt.dataCadastro', 'DESC')
      .getMany();

    return pedidosAlteracao.map(pedidoAlteracao => ({
      ...pedidoAlteracao.pedido,
      dataCadastro: pedidoAlteracao.dataCadastro,
    }));
  }

  async salvar(pedido: Pedido, qr?: QueryRunner): Promise<Pedido> {
    if (qr) {
      return await qr.manager.save(pedido);
    }

    return await this.repository.save(pedido);
  }
}