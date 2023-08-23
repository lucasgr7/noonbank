import { useTable } from './useTable';

export interface Stock {
  id: number;
  symbol: string;
  quantity: number;
  investment_type: 'brazilian_stock' | 'us_stock' | 'brazilian_treasury_bond' | 'liquid_investment';
}

const columns = {
  "id": {
    "type": "integer",
    "nullable": false
  },
  "symbol": {
    "type": "varchar",
    "nullable": false
  },
  "quantity": {
    "type": "integer",
    "nullable": false
  },
  "investment_type": {
    "type": "varchar",
    "nullable": false
  }
}

export function useStock(){
  return useTable<Stock>('stocks', columns);
}