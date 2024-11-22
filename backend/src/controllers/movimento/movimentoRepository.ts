import { Database } from '../../database';
import { Movimento } from '../../models/Movimento';
import { MovimentoListagemParametrosDTO } from './dto/MovimentoListagemParametrosDTO';

export class MovimentoRepository {
  private readonly repository = Database.getRepository(Movimento);

  async listarPorProduto(parametros: MovimentoListagemParametrosDTO): Promise<[Movimento[], number]> {
    return await this.repository
      .createQueryBuilder('mov')
      .where('mov.empresa = :idEmpresa', { idEmpresa: parametros.idEmpresa })
      .andWhere('mov.produto = :produtoId', { produtoId: parametros.produtoId })
      .andWhere('mov.ativo IS TRUE')
      .limit(parametros.itensPagina)
      .offset((parametros.paginaAtual - 1) * parametros.itensPagina)
      .orderBy('mov.id', 'DESC')
      .getManyAndCount();
  }

  async salvar(arquivo: Movimento): Promise<Movimento> {
    return this.repository.save(arquivo);
  }
}