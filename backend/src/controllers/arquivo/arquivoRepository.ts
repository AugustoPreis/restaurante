import { Database } from '../../database';
import { Arquivo } from '../../models/Arquivo';

export class ArquivoRepository {
  private readonly repository = Database.getRepository(Arquivo);

  async buscarPorUuid(uuid: string): Promise<Arquivo> {
    return await this.repository
      .createQueryBuilder('arquivo')
      .where('arquivo.uuid = :uuid', { uuid })
      .andWhere('arquivo.ativo IS TRUE')
      .getOne();
  }

  async salvar(arquivo: Arquivo): Promise<Arquivo> {
    return this.repository.save(arquivo);
  }
}