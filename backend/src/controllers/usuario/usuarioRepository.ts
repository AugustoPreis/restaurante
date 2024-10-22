import { Database } from '../../database';
import { Usuario } from '../../models/Usuario';
import { UsuarioListagemParametrosDTO } from './dtos/UsuarioListagemParametrosDTO';

export class UsuarioRepository {
  private readonly repository = Database.getRepository(Usuario);

  async buscarPorId(id: number): Promise<Usuario> {
    return await this.repository
      .createQueryBuilder('usuario')
      .innerJoinAndSelect('usuario.empresa', 'empresa')
      .where('usuario.id = :id', { id })
      .andWhere('usuario.ativo IS TRUE')
      .getOne();
  }

  async buscarPorLogin(login: string): Promise<Usuario[]> {
    return await this.repository
      .createQueryBuilder('usuario')
      .addSelect('usuario.senha')
      .innerJoinAndSelect('usuario.empresa', 'empresa')
      .where('usuario.login ILIKE :login', { login })
      .andWhere('usuario.ativo IS TRUE')
      .andWhere('empresa.ativo IS TRUE')
      .getMany();
  }

  async listar(parametros: UsuarioListagemParametrosDTO): Promise<[Usuario[], number]> {
    const qb = this.repository
      .createQueryBuilder('usuario')
      .where('usuario.empresa = :idEmpresa', { idEmpresa: parametros.idEmpresa })
      .andWhere('usuario.ativo IS TRUE')
      .andWhere(`usuario.nome ILIKE '%'||:filtro||'%'`, { filtro: parametros.filtro })
      .limit(parametros.itensPagina)
      .offset((parametros.paginaAtual - 1) * parametros.itensPagina)
      .orderBy('usuario.nome');

    const ascOrDesc = parametros.crescente ? 'ASC' : 'DESC';

    switch (parametros.ordem) {
      case 'nome':
        qb.orderBy('usuario.nome', ascOrDesc);
        break;
    }

    return await qb.getManyAndCount();
  }

  async salvar(usuario: Usuario): Promise<Usuario> {
    return await this.repository.save(usuario);
  }
}