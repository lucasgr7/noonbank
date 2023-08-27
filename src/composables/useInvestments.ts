import { Ref, ref, watch } from "vue";
import { Stock, useStock } from "./useStock";
import { getDolarCotation, getStockSum } from "../services/alhpaVantage";

export interface Investment{
  name: string;
  date: string;
  closeValue: number;
}

const { validRecrods: records, getValidStocks: getRecords } = useStock();
const dolarCottation = await getDolarCotation();
getRecords();

export const useInvestments = (period: Ref<Date[]>) => {
  const investmentsSeries = ref([] as Investment[]);
  const isStockUS = (symbol: string) => records.value?.some((stock: Stock) => stock.symbol === symbol && stock.investment_type === 'us_stock');

  watch(() => period.value, async ({startDate, endDate}: {startDate: Date, endDate: Date}) => {
    if (!records?.value) return;
    investmentsSeries.value = [];
    const calls = records.value.map(stock => getStockSum(stock.investment_type === 'brazilian_stock' ? `${stock.symbol}.SAO` : stock.symbol));
    
    const responses = await Promise.all(calls);

    responses.forEach((stock, i) => {
      if (!stock) return;
      const symbol = records?.value[i].symbol;
      const data = stock['Monthly Time Series'];
      const baseMultiplier = isStockUS(symbol) ? Number(dolarCottation) : 1;

      Object.entries(data).forEach(([date, value]) => {
        const dateObj = new Date(date);
        if (dateObj >= startDate && dateObj <= endDate) {
          investmentsSeries.value.push({
            name: symbol,
            date,
            closeValue: Number(((value['4. close'] * records?.value[i].quantity) * baseMultiplier).toFixed(2))
          });
        }
        if (dateObj < startDate) return false;
      });
    });

    console.log('series ', investmentsSeries.value);
  });

  return {
    investmentsSeries
  };
};
