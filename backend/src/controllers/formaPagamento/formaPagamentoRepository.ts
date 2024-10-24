import { Database } from '../../database';
import { FormaPagamento } from '../../models/FormaPagamento';

export class FormaPagamentoRepository {
  private readonly repository = Database.getRepository(FormaPagamento);

  async listar(filtro: string): Promise<[FormaPagamento[], number]> {
    return await this.repository
      .createQueryBuilder('forpag')
      .where('forpag.ativo IS TRUE')
      .andWhere(`forpag.descricao ILIKE '%'||:filtro||'%'`, { filtro })
      .orderBy('forpag.descricao')
      .limit(10)
      .getManyAndCount();
  }
}