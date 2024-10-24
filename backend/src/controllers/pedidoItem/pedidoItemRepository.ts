import { QueryRunner } from 'typeorm';
import { Database } from '../../database';
import { PedidoItem } from '../../models/PedidoItem';

export class PedidoItemRepository {
  private readonly repository = Database.getRepository(PedidoItem);

  async buscarPorPedido(pedidoId: number, qr?: QueryRunner): Promise<PedidoItem[]> {
    return await this.repository
      .createQueryBuilder('pedidoItem', qr)
      .innerJoinAndSelect('pedidoItem.produto', 'produto')
      .where('pedidoItem.pedido = :pedidoId', { pedidoId })
      .andWhere('pedidoItem.ativo IS TRUE')
      .orderBy('pedidoItem.id')
      .getMany();
  }

  async buscarParaInativacao(pedidoId: number, ids: number[], qr: QueryRunner): Promise<PedidoItem[]> {
    const qb = this.repository
      .createQueryBuilder('pedidoItem', qr)
      .where('pedidoItem.pedido = :pedidoId', { pedidoId });

    if (ids.length) {
      qb.andWhere('pedidoItem.id NOT IN (:...ids)', { ids });
    }

    return await qb.getMany();
  }

  async salvar(pedidoItem: PedidoItem, qr?: QueryRunner): Promise<PedidoItem> {
    if (qr) {
      return await qr.manager.save(pedidoItem);
    }

    return await this.repository.save(pedidoItem);
  }
}