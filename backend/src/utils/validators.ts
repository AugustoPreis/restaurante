import bufferType from 'buffer-type';
import { StringConfig, NumberConfig, DateConfig } from '../types/ValidatorConfig';

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isValidString(value: unknown, config?: StringConfig): value is string {
  if (!isString(value)) {
    return false;
  }

  if (!config?.empty && value.trim().length === 0) {
    return false;
  }

  if (config?.minLength && value.length < config.minLength) {
    return false;
  }

  if (config?.maxLength && value.length > config.maxLength) {
    return false;
  }

  if (config?.length && value.length !== config.length) {
    return false;
  }

  return true;
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isValidNumber(value: unknown, config?: NumberConfig): value is number {
  if (config?.allowString) {
    value = Number(value);
  }

  if (!isNumber(value)) {
    return false;
  }

  if (isNaN(value)) {
    return false;
  }

  if (config?.min && value < config.min) {
    return false;
  }

  if (config?.max && value > config.max) {
    return false;
  }

  return true;
}

export function isValidPagination(pagina: unknown, itensPagina: unknown): boolean {
  const isValidPagina = isValidNumber(pagina, { allowString: true, min: 1 });
  const isValidItensPagina = isValidNumber(itensPagina, { allowString: true, min: 1 });

  return isValidPagina && isValidItensPagina;
}

export function isBuffer(value: unknown): value is Buffer {
  return Buffer.isBuffer(value);
}

export function isValidBuffer(value: unknown): value is Buffer {
  return isBuffer(value) && value.length > 0;
}

export function isImage(value: unknown): value is Buffer {
  if (!isValidBuffer(value)) {
    return false;
  }

  const bufferTypeResult = bufferType(value);

  if (typeof bufferTypeResult?.type != 'string') {
    return false;
  }

  return bufferTypeResult.type.includes('image/');
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isValidDate(value: unknown, config?: DateConfig): value is Date {
  if (config?.allowString) {
    value = new Date(value as string);
  }

  if (!isDate(value)) {
    return false;
  }

  if (isNaN(value.getTime())) {
    return false;
  }

  return true;
}