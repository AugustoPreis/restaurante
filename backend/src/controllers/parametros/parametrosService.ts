import { parametrosRepository } from '.';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { Parametros } from '../../models/Parametros';
import { RequestError } from '../../utils/RequestError';
import { isValidString } from '../../utils/validators';

export class ParametrosService {

  async buscarPorNome(nome: keyof Parametros): Promise<unknown> {
    if (!isValidString(nome)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Nome do parâmetro inválido');
    }

    const parametro = await parametrosRepository.buscarPorNome(nome);

    return parametro ?? null;
  }
}