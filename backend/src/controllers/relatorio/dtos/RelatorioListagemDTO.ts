export type RelatorioListagemDTO = Partial<{
  id: number;
  codigo: string;
  titulo: string;
  descricao: string;
  filtros: string[];
}>