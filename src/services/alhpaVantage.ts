
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

export interface StockTopGainersAndLosers {
  metadata: string;
  last_updated: string;
  top_gainers: StockItem[];
  top_losers: StockItem[];
  most_actively_traded: StockItem[];
}

export interface StockItem {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
}

const SECONDS_IN_A_DAY = 24 * 60 * 60;
const MILLISECONDS_IN_A_SECOND = 1000;
const DAYS_TO_MS_THRESHOLD = 1;
const SEVEN_DAYS_CACHE = 7;

function isDataFresh(timestamp: number, days: number = DAYS_TO_MS_THRESHOLD): boolean {
    const currentTime = Date.now();
    const timeDifferenceInMilliseconds = currentTime - timestamp;
    const timeDifferenceInDays = timeDifferenceInMilliseconds / (SECONDS_IN_A_DAY * MILLISECONDS_IN_A_SECOND);
    return timeDifferenceInDays < days;
}

function cacheData(key: string, data: any){
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}

function getCacheData(key: string, days: number = DAYS_TO_MS_THRESHOLD){
  const cachedData = localStorage.getItem(key);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (isDataFresh(timestamp, days)) {
      return data;
    }
  }
  return null;
}


async function fetchData(url: string): Promise<any> {
  const apiKey = import.meta.env.VITE_APP_ALPHA_KEY;
  const response = await fetch(`${url}&apikey=${apiKey}`);
  const data = await response.json();
  
  if (data['Information']) {
      throw new Error(data['Information']);
  }
  
  return data;
}

export async function getStockSum(symbol: string): Promise<APIResponse | null> {
  try {
    // Define cache key
    const cacheKey = `stock_${symbol}`;

    // If cached data exists and is not older than 20 days, return it
    const cachedData = getCacheData(cacheKey, SEVEN_DAYS_CACHE);
    if (cachedData) {
      return cachedData;
    }
    
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}`;
    const data = await fetchData(url);
    cacheData(cacheKey, data);

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

    const cachedData = getCacheData(cacheKey, SEVEN_DAYS_CACHE);
    if (cachedData) {
      return cachedData;
    }

    const url = "https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=BRL";
    const data = await fetchData(url);
    
    // get latest from data['Time Series FX (Daily)']
    const latestKey = Object.keys(data['Time Series FX (Daily)'])[0];
    const dolarValue = data['Time Series FX (Daily)'][latestKey]['4. close'] as any;
    // Cache the result for 20 days
    cacheData(cacheKey, dolarValue);

    return dolarValue as string;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTopGainersAndLosers(): Promise<StockTopGainersAndLosers>{
  const cacheKey = 'top_gainers_and_losers';

  const cachedData = getCacheData(cacheKey, SEVEN_DAYS_CACHE);
  if (cachedData) {
    return cachedData;
  }

  const url = 'https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS'
  const data = await fetchData(url);
  cacheData(cacheKey, data);

  return data as StockTopGainersAndLosers;
}
// get https://www.alphavantage.co/query?function=SMA&symbol=IBM&interval=weekly&time_period=10&series_type=open&apikey=demo
export async function getStockSMA(symbol: string, 
  interval: 'strdaily' | 'weekly' | 'monthly',
  time_period: number, 
  series_type:   'close' | 'open' | 'high' | 'low'): Promise<any>{
  const cacheKey = `stock_sma_${symbol}_${interval}_${time_period}_${series_type}`;

  const cachedData = getCacheData(cacheKey, SEVEN_DAYS_CACHE);
  if (cachedData) {
    return cachedData;
  }

  const url = `https://www.alphavantage.co/query?function=SMA&symbol=${symbol}&interval=${interval}&time_period=${time_period}&series_type=${series_type}`;
  const data = await fetchData(url);
  cacheData(cacheKey, data);

  return data;
}

// get https://www.alphavantage.co/query?function=MACD&symbol=IBM&interval=daily&series_type=open&apikey=demo
export async function getStockMACD(symbol: string,
  interval: 'strdaily' | 'weekly' | 'monthly',
  series_type:   'close' | 'open' | 'high' | 'low'): Promise<any>{
  const cacheKey = `stock_macd_${symbol}_${interval}_${series_type}`;

  const cachedData = getCacheData(cacheKey, SEVEN_DAYS_CACHE);
  if (cachedData) {
    return cachedData;
  }

  const url = `https://www.alphavantage.co/query?function=MACD&symbol=${symbol}&interval=${interval}&series_type=${series_type}`;
  const data = await fetchData(url);
  cacheData(cacheKey, data);

  return data;
}

// get https://www.alphavantage.co/query?function=RSI&symbol=IBM&interval=weekly&time_period=10&series_type=open&apikey=demo
export async function getStockRSI(symbol: string,
  interval: 'strdaily' | 'weekly' | 'monthly',
  time_period: number, 
  series_type:   'close' | 'open' | 'high' | 'low'): Promise<any>{
  const cacheKey = `stock_rsi_${symbol}_${interval}_${time_period}_${series_type}`;

  const cachedData = getCacheData(cacheKey, SEVEN_DAYS_CACHE);
  if (cachedData) {
    return cachedData;
  }

  const url = `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=${interval}&time_period=${time_period}&series_type=${series_type}`;
  const data = await fetchData(url);
  cacheData(cacheKey, data);

  return data;
}

// get https://www.alphavantage.co/query?function=ATR&symbol=IBM&interval=daily&time_period=14&apikey=demo
export async function getStockATR(symbol: string,
  interval: 'strdaily' | 'weekly' | 'monthly',
  time_period: number): Promise<any>{
  const cacheKey = `stock_atr_${symbol}_${interval}_${time_period}`;

  const cachedData = getCacheData(cacheKey, SEVEN_DAYS_CACHE);
  if (cachedData) {
    return cachedData;
  }

  const url = `https://www.alphavantage.co/query?function=ATR&symbol=${symbol}&interval=${interval}&time_period=${time_period}`;
  const data = await fetchData(url);
  cacheData(cacheKey, data);

  return data;
}

// get https://www.alphavantage.co/query?function=BBANDS&symbol=IBM&interval=weekly&time_period=5&series_type=close&nbdevup=3&nbdevdn=3&apikey=demo
export async function getStockBBANDS(symbol: string,
  interval: 'strdaily' | 'weekly' | 'monthly',
  time_period: number,
  series_type:   'close' | 'open' | 'high' | 'low',
  nbdevup: number,
  nbdevdn: number): Promise<any>{
  const cacheKey = `stock_bbands_${symbol}_${interval}_${time_period}_${series_type}_${nbdevup}_${nbdevdn}`;

  const cachedData = getCacheData(cacheKey, SEVEN_DAYS_CACHE);
  if (cachedData) {
    return cachedData;
  }

  const url = `https://www.alphavantage.co/query?function=BBANDS&symbol=${symbol}&interval=${interval}&time_period=${time_period}&series_type=${series_type}&nbdevup=${nbdevup}&nbdevdn=${nbdevdn}`;
  const data = await fetchData(url);
  cacheData(cacheKey, data);

  return data;
}

// get https://www.alphavantage.co/query?function=ADX&symbol=IBM&interval=daily&time_period=10&apikey=demo
export async function getStockADX(symbol: string,
  interval: 'strdaily' | 'weekly' | 'monthly',
  time_period: number): Promise<any>{
  const cacheKey = `stock_adx_${symbol}_${interval}_${time_period}`;

  const cachedData = getCacheData(cacheKey, SEVEN_DAYS_CACHE);
  if (cachedData) {
    return cachedData;
  }

  const url = `https://www.alphavantage.co/query?function=ADX&symbol=${symbol}&interval=${interval}&time_period=${time_period}`;
  const data = await fetchData(url);
  cacheData(cacheKey, data);

  return data;
}

export interface CompanyInfo {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  CIK: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  Address: string;
  FiscalYearEnd: string;
  LatestQuarter: string;
  MarketCapitalization: string;
  EBITDA: string;
  PERatio: string;
  PEGRatio: string;
  BookValue: string;
  DividendPerShare: string;
  DividendYield: string;
  EPS: string;
  RevenuePerShareTTM: string;
  ProfitMargin: string;
  OperatingMarginTTM: string;
  ReturnOnAssetsTTM: string;
  ReturnOnEquityTTM: string;
  RevenueTTM: string;
  GrossProfitTTM: string;
  DilutedEPSTTM: string;
  QuarterlyEarningsGrowthYOY: string;
  QuarterlyRevenueGrowthYOY: string;
  AnalystTargetPrice: string;
  TrailingPE: string;
  ForwardPE: string;
  PriceToSalesRatioTTM: string;
  PriceToBookRatio: string;
  EVToRevenue: string;
  EVToEBITDA: string;
  Beta: string;
  "52WeekHigh": string;
  "52WeekLow": string;
  "50DayMovingAverage": string;
  "200DayMovingAverage": string;
  SharesOutstanding: string;
  DividendDate: string;
  ExDividendDate: string;
}


// get https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=demo
export async function getStockOverview(symbol: string): Promise<CompanyInfo>{
  const cacheKey = `stock_overview_${symbol}`;

  const cachedData = getCacheData(cacheKey, SEVEN_DAYS_CACHE);
  if (cachedData) {
    return cachedData;
  }

  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}`;
  const data = await fetchData(url);
  cacheData(cacheKey, data);

  return data;
}

export async function getStockData(symbol: string, interval: 'strdaily' | 'weekly' | 'monthly'): Promise<any>{
  const stockADX = getStockADX(symbol, interval, 10);
  const stockBBANDS = getStockBBANDS(symbol, interval, 5, 'close', 3, 3);
  const stockATR = getStockATR(symbol, interval, 14);
  const stockRSI = getStockRSI(symbol, interval, 10, 'close');
  const stockMACD = getStockMACD(symbol, interval, 'close');
  const stockSMA = getStockSMA(symbol, interval, 10, 'close');
  const fundamental = getStockOverview(symbol);

  const all = await Promise.all([stockADX, stockBBANDS, stockATR, stockRSI, stockMACD, stockSMA, fundamental]);

  return {
    stockADX: all[0],
    stockBBANDS: all[1],
    stockATR: all[2],
    stockRSI: all[3],
    stockMACD: all[4],
    stockSMA: all[5],
    fundamental: all[6] as CompanyInfo,
  }
}