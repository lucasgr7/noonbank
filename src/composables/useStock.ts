import { supabase } from './supabase';
import { ref } from 'vue';

export interface Stock {
  id: number;
  symbol: string;
  quantity: number;
  type: string;
}

const stocks = ref();

export function useStock(){
  const error = ref();

  async function insertStock(form: Stock){
    if(!form.symbol || !form.quantity || !form.type){
      error.value = 'Invalid input';
      return;
    }
    try{
      const {data, error} = await supabase
        .from('stocks')
        .insert([
          {
            symbol: form.symbol,
            quantity: Number(form.quantity),
            investment_type: form.type,
          },
        ]).select();
      console.log('data', data)
      if(error) throw error;
      await getStocks();
    }
    catch(err){
      error.value = err;
    }
  }

  async function getStocks(){
    try{
      const {data, error} = await supabase.from('stocks').select();
      if(error) throw error;
      stocks.value = data;
    }
    catch(err){
      error.value = err;
    }
  }

  return {
    stocks,
    error,
    insertStock,
    getStocks,
  }
}