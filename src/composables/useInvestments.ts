import { Ref, ref, watch } from "vue";
import { Stock, useStock } from "./useStock";
import { getStockSum } from "../services/alhpaVantage";

export interface Investment{
  name: string;
  date: string;
  closeValue: number;
}

const { records, getRecords } = useStock();
getRecords();

export const useInvestments = (period: Ref<Date[]>) => {
  const investmentsSeries = ref([] as Investment[]);
  watch(() => period.value, async (newDates: {startDate: Date, endDate: Date}) => {
    if(records?.value === undefined) return;
    investmentsSeries.value = [] as Investment[];
    const calls = [];

    for(let i = 0; i < records?.value.length; i++) {
      const stock = records?.value[i] as Stock;
      let symbol = stock.symbol;
      if(stock.investment_type === 'brazilian_stock'){
        symbol += '.SAO';
      }
      calls.push(getStockSum(symbol));
    }
  
    // wait all calls to finish
    const responses = await Promise.all(calls);

    for(let i = 0; i < responses.length; i++) {
      const stock = responses[i];
      if(!stock) continue;
      const symbol = records?.value[i].symbol;
      const data = stock['Monthly Time Series'] as any;

      if(data == null || data.length === 0) continue;

      // reverse data

      // filter objects from data where is between newDates.startDate and endDate
      for(let x = 0; x < Object.values(data).length; x++) {
        const date = Object.keys(data)[x];
        const dateObj = new Date(date);
        if(dateObj >= newDates.startDate && dateObj <= newDates.endDate) {
          investmentsSeries.value.push({
            name: symbol,
            date: date,
            closeValue: Number((data[date]['4. close'] * records?.value[i].quantity).toFixed(2))
          })
        }
        // if is lower than startDate, exit the for
        if(dateObj < newDates.startDate) {
          break;
        }
      }
    }
    console.log('series ', investmentsSeries.value);

  })

  return {
    investmentsSeries
  }
}