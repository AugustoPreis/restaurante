import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'empresa' })
export class Empresa {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'razao_social' })
  razaoSocial: string;

  @Column({ name: 'nome_fantasia' })
  nomeFantasia: string;

  @Column({ name: 'cnpj' })
  cnpj: string;

  @Column({ name: 'estoque_negativo' })
  estoqueNegativo: boolean;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @Column({ name: 'data_cadastro', update: false })
  public dataCadastro: Date;

  constructor(id?: number) {
    this.id = id;
  }
}