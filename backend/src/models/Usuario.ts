import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from './Empresa';

@Entity({ name: 'usuario' })
export class Usuario {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'login' })
  login: string;

  @Column({ name: 'senha' })
  senha: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @Column({ name: 'adm' })
  admin: boolean;

  @Column({ name: 'data_cadastro', update: false })
  dataCadastro: Date;

  @Column({ name: 'data_alteracao', insert: false })
  dataAlteracao: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_cadastrou_id' })
  usuarioCadastrou: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_alterou_id' })
  usuarioAlterou: Usuario;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  constructor(id?: number) {
    this.id = id;
  }
}