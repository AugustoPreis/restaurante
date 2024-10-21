import { Database } from '../../database';
import { Empresa } from '../../models/Empresa';

export class EmpresaRepository {
  private readonly repository = Database.getRepository(Empresa);

  async buscarPorId(id: number): Promise<Empresa> {
    return await this.repository
      .createQueryBuilder('emp')
      .where('emp.id = :id', { id })
      .andWhere('emp.ativo IS TRUE')
      .getOne();
  }

  async salvar(empresa: Empresa): Promise<Empresa> {
    return await this.repository.save(empresa);
  }
}