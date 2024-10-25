import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'arquivo' })
export class Arquivo {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'uuid' })
  uuid: string;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'conteudo', type: 'bytea' })
  conteudo: Buffer;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @Column({ name: 'data_cadastro' })
  dataCadastro: Date;
}