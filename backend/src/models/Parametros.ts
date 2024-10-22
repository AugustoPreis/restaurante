import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'parametros' })
export class Parametros {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'data_cadastro' })
  dataCadastro: Date;

  @Column({ name: 'nome_sistema' })
  nomeSistema: string;

  @Column({ name: 'foto_padrao_produto', type: 'bytea' })
  fotoPadraoProduto: Buffer;
}