import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Mesa } from './Mesa';
import { Usuario } from './Usuario';
import { Empresa } from './Empresa';

@Entity({ name: 'pedido' })
export class Pedido {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'numero' })
  numero: number;

  @ManyToOne(() => Mesa)
  @JoinColumn({ name: 'mesa_id' })
  mesa: Mesa;

  @Column({ name: 'descricao' })
  descricao: string;

  @Column({ name: 'fechado' })
  fechado: boolean;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @Column({ name: 'data_cadastro', update: false })
  dataCadastro: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_cadastrou_id' })
  usuarioCadastrou: Usuario;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  constructor(id?: number) {
    this.id = id;
  }
}