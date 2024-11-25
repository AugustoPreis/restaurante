import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { empresaRepository } from '../controllers/empresa';
import { RelatorioImpressaoFiltroDTO } from '../controllers/relatorio/dtos/RelatorioImpressaoFiltroDTO';
import { formatCnpj } from '../utils/formatters';

export interface DefaultReportOptions extends PDFKit.PDFDocumentOptions {
  parametros?: RelatorioImpressaoFiltroDTO;
  titulo?: string;
}

export interface Config {
  x: number;
  y: number;
  endX: number;
  endY: number;
  page: number;
  parametros: RelatorioImpressaoFiltroDTO;
  titulo: string;
}

export class DefaultReport extends PDFDocument {
  readonly config: Partial<Config>;

  constructor({ parametros, titulo, ...options }: DefaultReportOptions = {}) {
    super({ size: 'A4', margin: 10, bufferPages: true, ...options });

    this.config = {
      x: 15,
      y: 15,
      endX: this.page.width - 15,
      endY: this.page.height - 15,
      page: 0,
      parametros,
      titulo,
    };
  }

  nextPage(add = true) {
    /*
      Evita replica de if em todos os relatórios

      Exemplo incorreto:
        if (condicao) {
          this.nextPage();
        }
      
      Exemplo correto:
        this.nextPage(condicao);
    */
    if (!add) {
      return;
    }

    this.addPage(this.options);

    this.config.page += 1;

    this.switchToPage(this.config.page);
  }

  async header(): Promise<DefaultReport> {
    const empresa = await empresaRepository.buscarPorId(this.config.parametros?.usuarioLogado?.empresa?.id);

    if (!empresa) {
      return this;
    }

    const { razaoSocial, nomeFantasia, cnpj } = empresa;
    const y = (this.page.height / 2) - 50;

    this
      .font('Helvetica-Bold', 35);

    const widthTitulo = this.widthOfString(this.config.titulo);
    const x = (this.page.width / 2) - (widthTitulo / 2);

    this
      .text(this.config.titulo, 0, y, { align: 'center' })
      .fontSize(12);

    this.labeledText('Razão Social', razaoSocial, x, y + 40, { width: widthTitulo });
    this.labeledText('Nome Fantasia', nomeFantasia, x, y + 60, { width: widthTitulo });
    this.labeledText('CNPJ', formatCnpj(cnpj), x, y + 80, { width: widthTitulo });

    const dataEmissaoFormatada = format(new Date(), "dd 'de' MMMM 'de' yyyy, 'às' HH:mm", { locale: ptBR });

    this
      .fontSize(10)
      .text(`Relatório emitido em ${dataEmissaoFormatada}, por ${this.config.parametros.usuarioLogado.nome}`, this.config.x, this.config.endY - 10);

    this.nextPage();

    return this;
  }

  labeledText(label: string, text: string, x: number, y: number, options?: PDFKit.Mixins.TextOptions): DefaultReport {
    this
      .font('Helvetica-Bold')
      .text(`${label}: `, x, y, { ...options, continued: true })
      .font('Helvetica')
      .text(text, options);

    return this;
  }

  finish(): DefaultReport {
    const margem = this.options.margin || 10;

    //adiciona borda em todas as páginas
    for (let i = 0; i <= this.config.page; i++) {
      this.switchToPage(i);

      this
        .rect(margem, margem, this.page.width - (margem * 2), this.page.height - (margem * 2))
        .stroke();
    }

    return this;
  }

  async getBuffer(): Promise<Buffer> {
    const pdfChunks = [];

    return new Promise((resolve) => {
      this.on('data', (chunk) => {
        pdfChunks.push(chunk);
      });

      this.on('end', () => {
        resolve(Buffer.concat(pdfChunks));
      });

      this.end();
    });
  }
}