import { UsuarioLogadoDTO } from '../../usuario/dtos/UsuarioLogadoDTO';

export type RelatorioImpressaoFiltroDTO = Partial<{
  usuarioId: number;
  produtoId: number;
  relatorioId: number;
  usuarioLogado: UsuarioLogadoDTO;
  dataInicio: Date;
  dataFim: Date;
}>