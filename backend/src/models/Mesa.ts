import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './Usuario';
import { Empresa } from './Empresa';

@Entity({ name: 'mesa' })
export class Mesa {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'numero', update: false })
  numero: number;

  @Column({ name: 'descricao' })
  descricao: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @Column({ name: 'data_cadastro', update: false })
  dataCadastro: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_cadastrou_id' })
  usuarioCadastrou: Usuario;

  @Column({ name: 'data_alteracao', insert: false })
  dataAlteracao: Date;

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