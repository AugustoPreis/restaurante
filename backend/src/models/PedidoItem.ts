import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pedido } from './Pedido';
import { Produto } from './Produto';
import { Usuario } from './Usuario';
import { Empresa } from './Empresa';

@Entity({ name: 'pedido_item' })
export class PedidoItem {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'comanda' })
  comanda: number;

  @ManyToOne(() => Pedido)
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @ManyToOne(() => Produto)
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @Column({ name: 'quantidade', type: 'numeric' })
  quantidade: number;

  @Column({ name: 'valor', type: 'numeric' })
  valor: number;

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