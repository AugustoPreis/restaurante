export interface CanFormatOptions {
  value: unknown;
  length?: number;
  type?: 'string' | 'number';
}

export const MASKS = {
  CPF: {
    regex: /(\d{3})(\d{3})(\d{3})(\d{2})/g,
    pattern: '$1.$2.$3-$4',
  },
  CNPJ: {
    regex: /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    pattern: '$1.$2.$3/$4-$5',
  },
}

export function canFormat(options: CanFormatOptions): boolean {
  const { value, length, type } = options;

  if (type && typeof value != type) {
    return false;
  }

  if (length && (typeof value != 'string' || value.length != length)) {
    return false;
  }

  return true;
}

export function formatCpf(value: string): string {
  const format = canFormat({ value, type: 'string', length: 11 });

  if (!format) {
    return value;
  }

  const mask = MASKS.CPF;

  return value.replace(mask.regex, mask.pattern);
}

export function formatCnpj(value: string): string {
  const format = canFormat({ value, type: 'string', length: 14 });

  if (!format) {
    return value;
  }

  const mask = MASKS.CNPJ;

  return value.replace(mask.regex, mask.pattern);
}

export function formatValor(value: number, decimais: number = 2): number {
  const base = Math.pow(10, decimais);

  return Math.round(value * base) / base;
}