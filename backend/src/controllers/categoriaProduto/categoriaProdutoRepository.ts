import { Database } from '../../database';
import { CategoriaProduto } from '../../models/CategoriaProduto';
import { CategoriaProdutoListagemParametrosDTO } from './dtos/CategoriaProdutoListagemParametrosDTO';

export class CategoriaProdutoRepository {
  private readonly repository = Database.getRepository(CategoriaProduto);

  async listar(parametros: CategoriaProdutoListagemParametrosDTO): Promise<[CategoriaProduto[], number]> {
    const qb = this.repository
      .createQueryBuilder('catpro')
      .where('catpro.empresa = :empresa', { empresa: parametros.idEmpresa })
      .andWhere('catpro.ativo IS TRUE')
      .andWhere(`catpro.descricao ILIKE '%'||:filtro||'%'`, { filtro: parametros.filtro })
      .limit(parametros.itensPagina)
      .offset((parametros.paginaAtual - 1) * parametros.itensPagina)
      .orderBy('catpro.descricao')

    const ascOrDesc = parametros.crescente ? 'ASC' : 'DESC';

    switch (parametros.ordem) {
      case 'descricao':
        qb.orderBy('catpro.descricao', ascOrDesc);
        break;
    }

    return await qb.getManyAndCount();
  }

  async buscarPorId(id: number): Promise<CategoriaProduto> {
    return await this.repository
      .createQueryBuilder('catpro')
      .innerJoinAndSelect('catpro.empresa', 'empresa')
      .where('catpro.id = :id', { id })
      .andWhere('catpro.ativo IS TRUE')
      .getOne();
  }

  async salvar(categoriaProduto: CategoriaProduto): Promise<CategoriaProduto> {
    return await this.repository.save(categoriaProduto);
  }
}