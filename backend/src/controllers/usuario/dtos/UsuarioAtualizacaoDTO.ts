export type UsuarioAtualizacaoDTO = Partial<{
  id: number;
  nome: string;
  login: string;
  senha: string;
  admin: boolean;
}>