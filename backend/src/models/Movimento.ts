import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from './Produto';
import { PedidoItem } from './PedidoItem';
import { Usuario } from './Usuario';
import { Empresa } from './Empresa';

@Entity({ name: 'movimento' })
export class Movimento {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Produto)
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @Column({ name: 'tipo' })
  tipo: string;

  @Column({ name: 'quantidade', type: 'numeric' })
  quantidade: number;

  @Column({ name: 'estoque', type: 'numeric' })
  estoque: number;

  @Column({ name: 'descricao' })
  descricao: string;

  @Column({ name: 'data_movimento' })
  dataMovimento: Date;

  @ManyToOne(() => PedidoItem)
  @JoinColumn({ name: 'pedido_item_id' })
  pedidoItem: PedidoItem;

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