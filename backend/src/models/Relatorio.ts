import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from './Empresa';

@Entity({ name: 'relatorio' })
export class Relatorio {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'codigo' })
  codigo: string;

  @Column({ name: 'titulo' })
  titulo: string;

  @Column({ name: 'descricao' })
  descricao: string;

  @Column({ name: 'filtros' })
  filtros: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @Column({ name: 'data_cadastro' })
  dataCadastro: Date;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  constructor(id?: number) {
    this.id = id;
  }
}