import { Database } from '../../database';
import { Parametros } from '../../models/Parametros';

export class ParametrosRepository {
  private readonly repository = Database.getRepository(Parametros);

  async buscarPorNome(nome: keyof Parametros): Promise<unknown> {
    const result = await this.repository
      .createQueryBuilder('param')
      .select(`param.${nome}`, nome)
      .getRawOne();

    return result?.[nome];
  }
}