import { Database } from '../../database';
import { Movimento } from '../../models/Movimento';

export class MovimentoRepository {
  private readonly repository = Database.getRepository(Movimento);

  async salvar(arquivo: Movimento): Promise<Movimento> {
    return this.repository.save(arquivo);
  }
}