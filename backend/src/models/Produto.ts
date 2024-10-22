import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './Usuario';
import { Empresa } from './Empresa';
import { CategoriaProduto } from './CategoriaProduto';

@Entity({ name: 'produto' })
export class Produto {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'codigo', update: false })
  codigo: string;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'descricao' })
  descricao: string;

  @Column({ name: 'valor', type: 'numeric' })
  valor: number;

  @ManyToOne(() => CategoriaProduto)
  @JoinColumn({ name: 'categoria_produto_id' })
  categoria: CategoriaProduto;

  @Column({ name: 'foto', type: 'bytea', select: false })
  foto: Buffer;

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