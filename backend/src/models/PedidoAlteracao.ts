import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pedido } from './Pedido';
import { Usuario } from './Usuario';
import { Empresa } from './Empresa';

@Entity({ name: 'pedido_alteracao' })
export class PedidoAlteracao {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Pedido)
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @Column({ name: 'tipo' })
  tipo: string;

  @Column({ name: 'data_cadastro' })
  dataCadastro: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_cadastrou_id' })
  usuarioCadastrou: Usuario;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;
}