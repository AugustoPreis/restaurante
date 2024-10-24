import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'forma_pagamento' })
export class FormaPagamento {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'descricao' })
  descricao: string;

  @Column({ name: 'ativo' })
  ativo: boolean;
}