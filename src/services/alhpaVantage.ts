
interface APIResponse {
  "Meta Data": MetaData;
  "Monthly Time Series": Record<string, DailyTimeSeries>;
}

interface MetaData {
  "1__Information": string;
  "2__Symbol": string;
  "3__Last_Refreshed": string;
  "4__Output_Size": string;
  "5__Time_Zone": string;
}

interface DailyTimeSeries {
  "1__open": string;
  "2__high": string;
  "3__low": string;
  "4__close": string;
  "5__volume": string;
}

export async function getStockSum(symbol: string): Promise<APIResponse | null> {
  try {
    // Define cache key
    const cacheKey = `stock_${symbol}`;
    const cachedData = localStorage.getItem(cacheKey);

    // If cached data exists and is not older than 20 days, return it
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < 20 * 24 * 60 * 60 * 1000) {
        return data as APIResponse;
      }
    }

    const apiKey = import.meta.env.VITE_APP_ALPHA_KEY;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if(data['Information']){
      throw new Error(data['Information']);
    }
    // Cache the result for 20 days
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));

    return data as APIResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getDolarCotation(){
  try {
    // define cache key
    const cacheKey = 'dolar';
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < 20 * 24 * 60 * 60 * 1000) {
        return data as APIResponse;
      }
    }

    const apiKey = import.meta.env.VITE_APP_ALPHA_KEY;
    const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=BRL&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if(data['Information']){
      throw new Error(data['Information']);
    }
    // get latest from data['Time Series FX (Daily)']
    const latestKey = Object.keys(data['Time Series FX (Daily)'])[0];
    const dolarValue = data['Time Series FX (Daily)'][latestKey]['4. close'] as any;
    // Cache the result for 20 days
    localStorage.setItem(cacheKey, JSON.stringify({ data: dolarValue, timestamp: Date.now() }));

    return dolarValue as string;
  } catch (error) {
    console.error(error);
    return null;
  }
}