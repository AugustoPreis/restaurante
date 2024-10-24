import { Database } from '../../database';

export class FuncaoRepository {

  private async funcao<T>(nomeFuncao: string, parametros = []): Promise<T> {
    const query = await Database.query(`
      SELECT
        ${nomeFuncao}(${parametros.map((_, i) => `$${i + 1}`).join(', ')}) "result";
    `, parametros);

    return query?.[0]?.result;
  }

  async valorPedido(pedidoId: number): Promise<number> {
    const result = await this.funcao<number>('valor_pedido', [pedidoId]);

    return result;
  }
}