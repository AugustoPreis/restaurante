import { EmpresaLogadoDTO } from '../../empresa/dtos/EmpresaLogadoDTO';

export type UsuarioLogadoDTO = Partial<{
  token: string;

  id: number;
  nome: string;
  admin: boolean;
  empresa: EmpresaLogadoDTO;
}>