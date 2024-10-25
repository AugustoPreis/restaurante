import { Database } from '../../database';
import { Arquivo } from '../../models/Arquivo';

export class ArquivoRepository {
  private readonly repository = Database.getRepository(Arquivo);

  async salvar(arquivo: Arquivo): Promise<Arquivo> {
    return this.repository.save(arquivo);
  }
}