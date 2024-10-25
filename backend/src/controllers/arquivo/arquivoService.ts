import { arquivoRepository } from '.';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { Arquivo } from '../../models/Arquivo';
import { RequestError } from '../../utils/RequestError';
import { isValidBuffer, isValidString } from '../../utils/validators';
import { ArquivoCadastroDTO } from './dtos/ArquivoCadastroDTO';
import { ArquivoCadastroRetornoDTO } from './dtos/ArquivoCadastroRetornoDTO';

export class ArquivoService {

  async cadastrar(arquivoCadastroDTO: ArquivoCadastroDTO): Promise<ArquivoCadastroRetornoDTO> {
    const { nome, conteudo } = arquivoCadastroDTO;

    if (!isValidString(nome, { minLength: 1, maxLength: 100 })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Nome do arquivo inválido');
    }

    if (!isValidBuffer(conteudo)) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'Conteúdo do arquivo inválido');
    }

    const arquivoModel = new Arquivo();

    arquivoModel.uuid = crypto.randomUUID();
    arquivoModel.nome = nome.trim();
    arquivoModel.conteudo = conteudo;
    arquivoModel.dataCadastro = new Date();

    const arquivoSalvo = await arquivoRepository.salvar(arquivoModel);

    const arquivoCadastroRetornoDTO: ArquivoCadastroRetornoDTO = {};

    arquivoCadastroRetornoDTO.id = arquivoSalvo.id;
    arquivoCadastroRetornoDTO.uuid = arquivoSalvo.uuid;
    arquivoCadastroRetornoDTO.dataCadastro = arquivoSalvo.dataCadastro;

    return arquivoCadastroRetornoDTO;
  }
}