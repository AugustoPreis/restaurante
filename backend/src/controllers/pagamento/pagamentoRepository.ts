import { QueryRunner } from 'typeorm';
import { Database } from '../../database';
import { Pagamento } from '../../models/Pagamento';

export class PagamentoRepository {
  private readonly repository = Database.getRepository(Pagamento);

  async buscarPorId(id: number): Promise<Pagamento> {
    return await this.repository
      .createQueryBuilder('pagamento')
      .innerJoinAndSelect('pagamento.empresa', 'empresa')
      .where('pagamento.id = :id', { id })
      .andWhere('pagamento.ativo IS TRUE')
      .getOne();
  }

  async buscarPorComandaPedido(comanda: number, pedidoId: number): Promise<Pagamento[]> {
    return await this.repository
      .createQueryBuilder('pagamento')
      .innerJoinAndSelect('pagamento.empresa', 'empresa')
      .innerJoinAndSelect('pagamento.formaPagamento', 'formaPagamento')
      .where('pagamento.pedido = :pedidoId', { pedidoId })
      .andWhere('pagamento.comanda = :comanda', { comanda })
      .andWhere('pagamento.ativo IS TRUE')
      .orderBy('pagamento.id', 'DESC')
      .getMany();
  }

  async salvar(pagamento: Pagamento, qr?: QueryRunner): Promise<Pagamento> {
    if (qr) {
      return await qr.manager.save(pagamento);
    }

    return await this.repository.save(pagamento);
  }
}