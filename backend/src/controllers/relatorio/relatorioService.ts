import { relatorioRepository } from '.';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { defaultParams } from '../../utils/params';
import { RequestError } from '../../utils/RequestError';
import { isValidDate, isValidNumber, isValidString } from '../../utils/validators';
import { UsuarioLogadoDTO } from '../usuario/dtos/UsuarioLogadoDTO';
import { RelatorioImpressaoFiltroDTO } from './dtos/RelatorioImpressaoFiltroDTO';
import { RelatorioListagemDTO } from './dtos/RelatorioListagemDTO';
import { RelatorioListagemParametrosDTO } from './dtos/RelatorioListagemParametrosDTO';
import { RelatorioListagemResultadoDTO } from './dtos/RelatorioListagemResultadoDTO';
import { RelatorioImpressaoRetornoDTO } from './dtos/RelatorioImpressaoRetornoDTO';
import { DefaultReport } from '../../relatorios/DefaultReport';
import { arquivoService } from '../arquivo';

export class RelatorioService {

  async listar(relatorioListagemParametrosDTO: RelatorioListagemParametrosDTO, usuarioLogado: UsuarioLogadoDTO): Promise<RelatorioListagemResultadoDTO> {
    const parametros = defaultParams(relatorioListagemParametrosDTO, usuarioLogado);

    const [relatoriosModel, total] = await relatorioRepository.listar(parametros);

    const relatoriosListagemDTO: RelatorioListagemDTO[] = [];

    for (let i = 0; i < relatoriosModel.length; i++) {
      const relatorioModel = relatoriosModel[i];
      const relatorioListagemDTO: RelatorioListagemDTO = {};

      relatorioListagemDTO.id = relatorioModel.id;
      relatorioListagemDTO.codigo = relatorioModel.codigo;
      relatorioListagemDTO.titulo = relatorioModel.titulo;
      relatorioListagemDTO.descricao = relatorioModel.descricao;
      relatorioListagemDTO.filtros = [];

      if (isValidString(relatorioModel.filtros)) {
        relatorioListagemDTO.filtros = relatorioModel.filtros.split('-');
      }

      relatoriosListagemDTO.push(relatorioListagemDTO);
    }

    return { data: relatoriosListagemDTO, total };
  }

  async imprimir(relatorioImpressaoFiltroDTO: RelatorioImpressaoFiltroDTO, usuarioLogado: UsuarioLogadoDTO): Promise<RelatorioImpressaoRetornoDTO> {
    const { relatorioId, usuarioId, produtoId, dataInicio, dataFim } = relatorioImpressaoFiltroDTO;
    const parametros: RelatorioImpressaoFiltroDTO = {};

    if (!isValidNumber(relatorioId, { allowString: true })) {
      throw new RequestError(HttpStatusCode.BAD_REQUEST, 'ID do relatório não informado');
    }

    parametros.relatorioId = Number(relatorioId);

    if (isValidNumber(usuarioId, { allowString: true })) {
      parametros.usuarioId = Number(usuarioId);
    }

    if (isValidNumber(produtoId, { allowString: true })) {
      parametros.produtoId = Number(produtoId);
    }

    if (isValidDate(dataInicio) && isValidDate(dataFim)) {
      parametros.dataInicio = dataInicio;
      parametros.dataFim = dataFim;
    }

    const relatorioModel = await relatorioRepository.buscarPorId(parametros.relatorioId);

    if (!relatorioModel) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, 'Relatório não encontrado');
    }

    if (relatorioModel.empresa && relatorioModel.empresa.id != usuarioLogado.empresa.id) {
      throw new RequestError(HttpStatusCode.FORBIDDEN, 'Relatório não pertence a empresa do usuário logado');
    }

    const relatorioListagemDTO: RelatorioListagemDTO = {};

    relatorioListagemDTO.id = relatorioModel.id;
    relatorioListagemDTO.codigo = relatorioModel.codigo;
    relatorioListagemDTO.titulo = relatorioModel.titulo;

    const buffer = await this.relatorioPorCodigo(parametros, relatorioListagemDTO);

    const arquivoCadastroRetornoDTO = await arquivoService.cadastrar({
      nome: `${relatorioModel.titulo}.pdf`,
      conteudo: buffer,
    });

    return {
      uuid: arquivoCadastroRetornoDTO.uuid,
      tipo: relatorioModel.codigo,
    };
  }

  async relatorioPorCodigo(parametros: RelatorioImpressaoFiltroDTO, relatorioListagemDTO: RelatorioListagemDTO): Promise<Buffer> {
    const file: DefaultReport = new DefaultReport();

    if (!file) {
      throw new RequestError(HttpStatusCode.NOT_FOUND, `Relatório "${relatorioListagemDTO.titulo}" não implementado`);
    }

    return file.getBuffer();
  }
}