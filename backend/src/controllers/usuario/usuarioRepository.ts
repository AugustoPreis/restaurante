import { Database } from '../../database';
import { Usuario } from '../../models/Usuario';

export class UsuarioRepository {
  private readonly repository = Database.getRepository(Usuario);

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
}