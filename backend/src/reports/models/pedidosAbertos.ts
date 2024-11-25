import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { pedidoRepository } from '../../controllers/pedido';
import { pedidoItemRepository } from '../../controllers/pedidoItem';
import { RelatorioImpressaoFiltroDTO } from '../../controllers/relatorio/dtos/RelatorioImpressaoFiltroDTO';
import { DefaultReport } from '../DefaultReport';
import { isValidString } from '../../utils/validators';
import { formatReal, formatReportText } from '../../utils/formatters';
import { Pedido } from '../../models/Pedido';
import { PedidoItem } from '../../models/PedidoItem';

export async function relatorioPedidosAbertos(parametros: RelatorioImpressaoFiltroDTO) {
  const doc = new DefaultReport({ parametros: parametros, titulo: 'Relatório de Pedidos Abertos' });
  const pedidos = await pedidoRepository.pedidosAbertos(parametros);

  await doc.header();

  const { config } = doc;

  for (let i = 0; i < pedidos.length; i++) {
    const pedido = pedidos[i];
    const itens = await pedidoItemRepository.buscarPorPedido(pedido.id);
    let { y } = config;

    y = montaPedido(pedido, y);
    y = montaItens(itens, y);

    doc.nextPage(i != (pedidos.length - 1));
  }

  function montaPedido(pedido: Pedido, y: number) {
    let mesa = pedido.mesa.descricao;

    //Evita mostrar a palavra "mesa" 2 vezes
    if (!mesa.toLowerCase().includes('mesa')) {
      mesa = `Mesa ${mesa}`;
    }

    doc
      .font('Helvetica-Bold', 20)
      .text(`Pedido Nº ${pedido.numero}, ${mesa}`, 0, y + 5, { align: 'center' });

    y += 30;

    const dataCadastroFormatada = format(pedido.dataCadastro, "dd 'de' MMMM 'de' yyyy, 'às' HH:mm", { locale: ptBR });

    doc
      .font('Helvetica', 10)
      .text(`Aberto em ${dataCadastroFormatada}`, 0, y, { align: 'center' });

    y += 20;

    doc
      .moveTo(doc.options.margin, y)
      .lineTo(config.endX + 5, y)
      .stroke();

    y += 10;

    if (isValidString(pedido.descricao)) {
      const descricaoFormatada = formatReportText(pedido.descricao);

      doc
        .fontSize(11)
        .labeledText('Descrição', descricaoFormatada, config.x, y, { width: doc.config.endX - config.x });

      y += Math.round(doc.heightOfString(descricaoFormatada, { width: doc.config.endX - config.x })) + 10;
    }

    return y + 10;
  }

  function montaItens(itens: PedidoItem[], y: number) {
    if (!Array.isArray(itens) || itens.length === 0) {
      return y;
    }

    doc
      .font('Helvetica-Bold', 16)
      .text('Itens', 0, y, { align: 'center' });

    y += 35;

    doc
      .font('Helvetica-Bold', 10)
      .text('Comanda', config.x, y, { width: 55, align: 'center' })
      .text('Produto', config.x + 60, y)
      .text('Qtd', config.x + 390, y, { width: 40, align: 'center' })
      .text('Valor', config.x + 460, y);

    y += 20;

    doc
      .font('Helvetica', 10);

    for (let i = 0; i < itens.length; i++) {
      const item = itens[i];
      const nomeHeight = doc.heightOfString(item.produto.nome, { width: 325 });

      if (y + nomeHeight > doc.config.endY) {
        doc.nextPage();

        y = config.y;
      }

      if (i % 2 === 0) {
        doc
          .fillColor('#f0f0f0')
          .rect(doc.options.margin, y - 4, doc.config.endX - doc.options.margin + 5, nomeHeight + 4)
          .fill()
          .fillColor('#000000');
      }

      doc
        .text(item.comanda.toString(), config.x, y, { width: 55, align: 'center' })
        .text(item.produto.nome, config.x + 60, y, { width: 325 })
        .text(item.quantidade.toString(), config.x + 390, y, { width: 40, align: 'center' })
        .text(formatReal(item.valor), config.x + 460, y);

      y += nomeHeight + 4;
    }

    return y;
  }

  doc.finish();

  return doc;
}