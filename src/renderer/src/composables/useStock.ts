import { ref } from 'vue';
import { useSupaTable } from './useSupaTable';
import { supabase } from './supabase';

export interface Stock {
  id: number;
  symbol: string;
  quantity: number;
  investment_type: 'brazilian_stock' | 'us_stock' | 'brazilian_treasury_bond' | 'liquid_investment';
}

const columns = {
  "id": {
    "type": "integer",
    "nullable": true
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
  const supabaseSupaTable =  useSupaTable<Stock>('stocks', columns);
  const validRecrods = ref([] as Stock[]);

  async function getValidStocks(){
    const { data, error } = await supabase
      .from('stocks')
      .select()
      // where quantity > 1
      .gt('quantity', 1);

    if (error) throw error;

    validRecrods.value = data;
  }

  return {
    getValidStocks,
    validRecrods,
    ...supabaseSupaTable
  }
}