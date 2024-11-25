import PDFDocument from 'pdfkit';

export class DefaultReport extends PDFDocument {
  async getBuffer(): Promise<Buffer> {
    const pdfChunks = [];

    return new Promise((resolve) => {
      this.on('data', (chunk) => {
        pdfChunks.push(chunk);
      });

      this.on('end', async () => {
        resolve(Buffer.concat(pdfChunks));
      });

      this.end();
    });
  }
}