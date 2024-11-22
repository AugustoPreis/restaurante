import { Database } from '../../database';

export class FuncaoRepository {

  private async funcao<T>(nomeFuncao: string, parametros = []): Promise<T> {
    const query = await Database.query(`
      SELECT
        ${nomeFuncao}(${parametros.map((_, i) => `$${i + 1}`).join(', ')}) "result";
    `, parametros);

    return query?.[0]?.result;
  }

  async valorPedido(pedidoId: number, comanda?: number): Promise<number> {
    const result = await this.funcao<number>('valor_pedido', [pedidoId, comanda]);

    return result;
  }

  async valorPagoPedido(pedidoId: number, comanda?: number): Promise<number> {
    const result = await this.funcao<number>('valor_pago_pedido', [pedidoId, comanda]);

    return result;
  }

  async estoqueAtual(produtoId: number): Promise<number> {
    const result = await this.funcao<number>('estoque_atual', [produtoId]);

    return result;
  }
}