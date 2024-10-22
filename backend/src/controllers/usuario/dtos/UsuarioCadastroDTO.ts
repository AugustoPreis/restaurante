export type UsuarioCadastroDTO = Partial<{
  nome: string;
  login: string;
  senha: string;
  admin: boolean;
}>