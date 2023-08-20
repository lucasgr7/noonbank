
interface APIResponse {
  "Meta_Data": MetaData;
  "Monthly_Time_Series": Record<string, DailyTimeSeries>;
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
    const apiKey = import.meta.env.VITE_APP_ALPHA_KEY;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data as APIResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
}
