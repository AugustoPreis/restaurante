export function round(number: number, precision: number): number {
  const factor = Math.pow(10, precision || 0);

  if (typeof number != 'number') {
    number = Number(number);
  }

  if (isNaN(number) || isNaN(factor)) {
    return NaN;
  }

  return Math.round(number * factor) / factor;
}