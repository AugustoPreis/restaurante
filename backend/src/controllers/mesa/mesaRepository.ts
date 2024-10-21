import { Brackets } from 'typeorm';
import { Database } from '../../database';
import { Mesa } from '../../models/Mesa';
import { MesaListagemParametrosDTO } from './dtos/MesaListagemParametrosDTO';

export class MesaRepository {
  private readonly repository = Database.getRepository(Mesa);

  async listar(parametros: MesaListagemParametrosDTO): Promise<[Mesa[], number]> {
    const qb = this.repository
      .createQueryBuilder('mesa')
      .where('mesa.ativo IS TRUE')
      .andWhere('mesa.empresa = :empresa', { empresa: parametros.idEmpresa })
      .andWhere(
        new Brackets((bt) => {
          bt
            .where(`(mesa.numero)::varchar ILIKE '%'||:filtro||'%'`)
            .orWhere(`mesa.descricao ILIKE '%'||:filtro||'%'`);
        }), { filtro: parametros.filtro },
      )
      .limit(parametros.itensPagina)
      .offset((parametros.paginaAtual - 1) * parametros.itensPagina)
      .orderBy('mesa.numero')

    const ascOrDesc = parametros.crescente ? 'ASC' : 'DESC';

    switch (parametros.ordem) {
      case 'numero':
        qb.orderBy('mesa.numero', ascOrDesc);
        break;
      case 'descricao':
        qb.orderBy('mesa.descricao', ascOrDesc);
        break;
    }

    return await qb.getManyAndCount();
  }

  async buscarPorId(id: number): Promise<Mesa> {
    return await this.repository
      .createQueryBuilder('mesa')
      .innerJoinAndSelect('mesa.empresa', 'empresa')
      .where('mesa.id = :id', { id })
      .andWhere('mesa.ativo IS TRUE')
      .getOne();
  }

  async buscarPorNumero(mesa: Mesa): Promise<Mesa> {
    const qb = this.repository
      .createQueryBuilder('mesa')
      .where('mesa.numero = :numero', { numero: mesa.numero })
      .andWhere('mesa.empresa = :empresa', { empresa: mesa.empresa.id })
      .andWhere('mesa.ativo IS TRUE')

    if (mesa.id) {
      qb.andWhere('mesa.id <> :id', { id: mesa.id });
    }

    return await qb.getOne();
  }

  async salvar(mesa: Mesa): Promise<Mesa> {
    return await this.repository.save(mesa);
  }
}