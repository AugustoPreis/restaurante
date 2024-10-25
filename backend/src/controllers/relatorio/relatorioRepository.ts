import { Brackets } from 'typeorm';
import { Database } from '../../database';
import { Relatorio } from '../../models/Relatorio';
import { RelatorioListagemParametrosDTO } from './dtos/RelatorioListagemParametrosDTO';

export class RelatorioRepository {
  private readonly repository = Database.getRepository(Relatorio);

  async buscarPorId(id: number): Promise<Relatorio> {
    return await this.repository
      .createQueryBuilder('relatorio')
      .leftJoinAndSelect('relatorio.empresa', 'empresa')
      .where('relatorio.id = :id', { id })
      .andWhere('relatorio.ativo IS TRUE')
      .getOne();
  }

  async listar(parametros: RelatorioListagemParametrosDTO): Promise<[Relatorio[], number]> {
    return await this.repository
      .createQueryBuilder('relatorio')
      .where('relatorio.ativo IS TRUE')
      .andWhere(`relatorio.titulo ILIKE '%'||:filtro||'%'`, { filtro: parametros.filtro })
      .andWhere(
        new Brackets((bt) => {
          bt
            .where('relatorio.empresa IS NULL')
            .orWhere('relatorio.empresa = :idEmpresa');
        }), { idEmpresa: parametros.idEmpresa },
      )
      .orderBy('relatorio.id')
      .limit(parametros.itensPagina)
      .offset((parametros.paginaAtual - 1) * parametros.itensPagina)
      .getManyAndCount();
  }
}