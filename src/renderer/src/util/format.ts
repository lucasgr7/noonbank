/**
 * Converts 
 * @param value 
 * @returns 
 */
export function formatBrazilianReal(value: number | string): string {
  // Convert string to number if necessary
  const numberValue = typeof value === 'number' ? value : parseFloat(value);
  
  if (isNaN(numberValue)) {
    throw new Error('Invalid number');
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numberValue);
}