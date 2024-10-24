import { QueryRunner } from 'typeorm';
import { Database } from '../../database';
import { Pedido } from '../../models/Pedido';
import { PedidoListagemParametrosDTO } from './dtos/PedidoListagemParametrosDTO';

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

  async salvar(pedido: Pedido, qr?: QueryRunner): Promise<Pedido> {
    if (qr) {
      return await qr.manager.save(pedido);
    }

    return await this.repository.save(pedido);
  }
}