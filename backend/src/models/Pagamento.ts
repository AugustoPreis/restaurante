import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pedido } from './Pedido';
import { FormaPagamento } from './FormaPagamento';
import { Usuario } from './Usuario';
import { Empresa } from './Empresa';

@Entity({ name: 'pagamento' })
export class Pagamento {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Pedido)
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @Column({ name: 'comanda' })
  comanda: number;

  @Column({ name: 'valor', type: 'numeric' })
  valor: number;

  @ManyToOne(() => FormaPagamento)
  @JoinColumn({ name: 'forma_pagamento_id' })
  formaPagamento: FormaPagamento;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @Column({ name: 'data_cadastro' })
  dataCadastro: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_cadastrou_id' })
  usuarioCadastrou: Usuario;

  @Column({ name: 'data_alteracao' })
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