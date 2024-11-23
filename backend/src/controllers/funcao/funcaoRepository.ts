import { QueryRunner } from 'typeorm';
import { Database } from '../../database';

export class FuncaoRepository {

  private async funcao<T>(nomeFuncao: string, parametros = [], qr?: QueryRunner): Promise<T> {
    const sql = `
      SELECT
        ${nomeFuncao}(${parametros.map((_, i) => `$${i + 1}`).join(', ')}) "result";
    `;

    if (qr) {
      const rows = await qr.query(sql, parametros);

      return rows?.[0]?.result;
    }

    const rows = await Database.query(sql, parametros);

    return rows?.[0]?.result;
  }

  async valorPedido(pedidoId: number, comanda?: number): Promise<number> {
    const result = await this.funcao<number>('valor_pedido', [pedidoId, comanda]);

    return result;
  }

  async valorPagoPedido(pedidoId: number, comanda?: number): Promise<number> {
    const result = await this.funcao<number>('valor_pago_pedido', [pedidoId, comanda]);

    return result;
  }

  async estoqueAtual(produtoId: number, qr?: QueryRunner): Promise<number> {
    const result = await this.funcao<number>('estoque_atual', [produtoId], qr);

    return result;
  }
}