import { QueryRunner } from 'typeorm';
import { Database } from '../../database';
import { PedidoAlteracao } from '../../models/PedidoAlteracao';

export class PedidoAlteracaoRepository {
  private readonly repository = Database.getRepository(PedidoAlteracao);

  async salvar(pedidoAlteracao: PedidoAlteracao, qr?: QueryRunner): Promise<PedidoAlteracao> {
    if (qr) {
      return await qr.manager.save(pedidoAlteracao);
    }

    return await this.repository.save(pedidoAlteracao);
  }
}