export type RelatorioImpressaoFiltroDTO = Partial<{
  usuarioId: number;
  produtoId: number;
  relatorioId: number;
  dataInicio: Date;
  dataFim: Date;
}>