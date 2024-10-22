import { Brackets } from 'typeorm';
import { Database } from '../../database';
import { Produto } from '../../models/Produto';
import { ProdutoListagemParametrosDTO } from './dtos/ProdutoListagemParametrosDTO';

export class ProdutoRepository {
  private readonly repository = Database.getRepository(Produto);

  async listar(parametros: ProdutoListagemParametrosDTO): Promise<[Produto[], number]> {
    const qb = this.repository
      .createQueryBuilder('prod')
      .innerJoinAndSelect('prod.categoria', 'categoria')
      .where('prod.empresa = :idEmpresa', { idEmpresa: parametros.idEmpresa })
      .andWhere('prod.ativo IS TRUE')
      .andWhere(
        new Brackets((bk) => {
          bk
            .where(`prod.codigo ILIKE '%'||:filtro||'%'`)
            .orWhere(`prod.nome ILIKE '%'||:filtro||'%'`);
        }), { filtro: parametros.filtro }
      )
      .limit(parametros.itensPagina)
      .offset((parametros.paginaAtual - 1) * parametros.itensPagina)
      .orderBy('produto.codigo');

    const ascOrDesc = parametros.crescente ? 'ASC' : 'DESC';

    switch (parametros.ordem) {
      case 'codigo':
        qb.orderBy('prod.codigo', ascOrDesc);
        break;
      case 'nome':
        qb.orderBy('prod.nome', ascOrDesc);
        break;
    }

    return await qb.getManyAndCount();
  }

  async buscarPorId(id: number): Promise<Produto> {
    return await this.repository
      .createQueryBuilder('prod')
      .innerJoinAndSelect('prod.categoria', 'categoria')
      .where('prod.id = :id', { id })
      .andWhere('prod.ativo IS TRUE')
      .getOne();
  }

  async buscarPorCodigo(produto: Produto): Promise<Produto> {
    const qb = this.repository
      .createQueryBuilder('prod')
      .where('prod.codigo = :codigo', { codigo: produto.codigo })
      .andWhere('prod.empresa = :empresa', { empresa: produto.empresa.id })
      .andWhere('prod.ativo IS TRUE')

    if (produto.id) {
      qb.andWhere('prod.id <> :id', { id: produto.id });
    }

    return await qb.getOne();
  }

  async salvar(produto: Produto): Promise<Produto> {
    return await this.repository.save(produto);
  }
}