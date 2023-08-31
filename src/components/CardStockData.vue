<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { CompanyInfo, getStockData } from '../services/alhpaVantage';
import _ from 'lodash';

const props = defineProps(['title']);
const fundScore = ref(0);
const technicalScore = ref(0);

const data = ref();

const results = computed(() => {
  if (_.isEmpty(data.value)) {
    return [];
  }
  const adxData = data.value.stockADX['Technical Analysis: ADX'];
  const adxKey = Object.keys(adxData)[0];

  const smaData = data.value.stockSMA['Technical Analysis: SMA'];
  const smaKey = Object.keys(smaData)[0];

  const macdData = data.value.stockMACD['Technical Analysis: MACD'];
  const macdKey = Object.keys(macdData)[0];

  const rsiData = data.value.stockRSI['Technical Analysis: RSI'];
  const rsiKey = Object.keys(rsiData)[0];

  const atrData = data.value.stockATR['Technical Analysis: ATR'];
  const atrKey = Object.keys(atrData)[0];

  const bbandsData = data.value.stockBBANDS['Technical Analysis: BBANDS'];
  const bbandsKey = Object.keys(bbandsData)[0];

  return [{
    adx: adxData[adxKey].ADX,
    sma: smaData[smaKey].SMA,
    macd: macdData[macdKey].MACD,
    rsi: rsiData[rsiKey].RSI,
    atr: atrData[atrKey].ATR,
    bbands: bbandsData[bbandsKey]['Real Middle Band'],
    fundamental: data.value.fundamental as CompanyInfo,
  }];
})

const veredict = computed(() => {
  let technicalScore = 0;
  let fundamentalScore = 0;

  if (results.value.length === 0) {
    return { summary: 'No data', color: 'gray' };
  }

  const adx = parseFloat(results.value[0].adx);
  const sma = parseFloat(results.value[0].sma);
  const macd = parseFloat(results.value[0].macd);
  const rsi = parseFloat(results.value[0].rsi);
  const atr = parseFloat(results.value[0].atr);
  if (!_.isEmpty(results.value[0].fundamental)) {
    const fundamental = results.value[0].fundamental ?? {};
    fundamentalScore = fundamentalsAnalysis(fundamental, technicalScore);
  }

  technicalScore = calculateTechnicalScore(adx, sma, macd, rsi, atr);

  // Combined score using weights
  const combinedScore = (0.7 * technicalScore) + (0.3 * fundamentalScore);

  return createRecommendation(combinedScore);
});

function calculateTechnicalScore(adx: number, sma: number, macd: number, rsi: number, atr: number) {
  let score = 0;

  // ADX
  if (adx > 20 && adx < 30) score += 0.5;
  else if (adx >= 30 && adx <= 50) score += 1;

  // SMA
  if (sma > 10 && sma < 20) score += 0.3;
  else if (sma >= 20) score += 0.6;

  // MACD
  if (macd > 0 && macd < 1) score += 0.5;
  else if (macd >= 1) score += 1;

  // RSI
  if (rsi >= 30 && rsi <= 40) score += 0.3;
  else if (rsi > 40 && rsi < 70) score += 0.7;

  // ATR
  if (atr < 1) score += 0.2;
  else if (atr >= 1 && atr < 2) score += 0.5;


  technicalScore.value = score;

  return score;
}

function fundamentalsAnalysis(fundamentalData: any, score: number): number {
  if (!fundamentalData) {
    return 0;
  };

  let fundamentalScore = 0;

  // Fundamental factors
  const PERatio = parseFloat(fundamentalData.PERatio);
  const DividendYield = parseFloat(fundamentalData.DividendYield);
  const MarketCapitalization = parseFloat(fundamentalData.MarketCapitalization);
  const EBITDA = parseFloat(fundamentalData.EBITDA);

  // Evaluate PE Ratio (The lower, the better generally, but industry-specific)
  if (PERatio < 20) fundamentalScore += 2;
  else if (PERatio >= 20 && PERatio < 40) fundamentalScore += 1;

  // Evaluate Dividend Yield (The higher, the better)
  if (DividendYield >= 0.02 && DividendYield <= 0.05) score += 1;

  // Evaluate Market Capitalization (The bigger, often the more stable)
  if (MarketCapitalization > 1e11) fundamentalScore += 1;

  // Evaluate EBITDA (The higher, the better)
  if (EBITDA > 1e9) fundamentalScore += 1;

  // Combine technical and fundamental scores
  let combinedScore = score + fundamentalScore;

  fundScore.value = combinedScore;
  return combinedScore;
}

function createRecommendation(combinedScore: number) {

  // Create Recommendation
  let recommendation = "";
  let color = "";

  if (combinedScore <= 1) {
    recommendation = "Sell";
    color = "#FF7F7F";
  } else if (combinedScore > 0 && combinedScore <= 3) {
    recommendation = "Hold";
    color = "#FFBF80";
  } else if (combinedScore > 3 && combinedScore <= 5) {
    recommendation = "weak buy";
    color = "#FF1380";
  } else if (combinedScore > 5 && combinedScore <= 7) {
    recommendation = "Should Buy";
    color = "#80FF80";
  } else {
    recommendation = "Strong Buy";
    color = "#7FBFFF";
  }
  return { recommendation, color };
}

function evToEbitdaColor(evToEbitda: number) {
  if (evToEbitda < 10) {
    return 'green';
  } else if (evToEbitda >= 10 && evToEbitda < 20) {
    return 'orange';
  } else {
    return 'red';
  }
}

onMounted(async () => {
  data.value = await getStockData(props.title, 'monthly');
})
</script>
<template>
  <el-card class="card-stock-data">
    <template #header>
      <el-row>
        <div id="status" :style="{ 'backgroundColor': veredict.color }">{{ veredict.recommendation }}</div>
        {{ props.title }}
      </el-row>
      <el-row justify="center">
        <div class="box">
          <div>Fundamental Score</div>
          {{ fundScore }} 
        </div>
        <div class="box">
          <div>Technical Score</div>
          {{ technicalScore }}
        </div>
      </el-row>
    </template>
    <div v-if="results.length > 0 && !_.isEmpty(results[0].fundamental)">
      <el-row>
        <b>EVToEBITDA:</b>
        <span :style="{ marginLeft: '8px', color: evToEbitdaColor(results[0].fundamental.EVToEBITDA) }">
          {{ results[0].fundamental.EVToEBITDA }}
        </span>
      </el-row>
      <el-row>
        <b>Target Price:</b> <span :style="{ marginLeft: '8px' }">{{ results[0].fundamental.AnalystTargetPrice  }}</span>
      </el-row>
      <el-row>
        <b>Market Capitalization:</b>
        <span :style="{ marginLeft: '8px' }">
          {{ Number(results[0].fundamental.MarketCapitalization)  }}
        </span>
      </el-row>
      <el-row>
        <b>P/E Ratio:</b>
        <span
          :style="{ marginLeft: '8px', 
            color: Number(results[0].fundamental.PERatio > 25) ? 'red' : Number(results[0].fundamental.PERatio < 10) ? 'green' : 'orange' }">
          {{ results[0].fundamental.PERatio }}
        </span>
      </el-row>
      <el-row>
        <b>Dividend Yield:</b>
        <span :style="{ marginLeft: '8px', color: Number(results[0].fundamental.DividendYield) > 0.05 ? 'green' : 'red' }">
          {{ results[0].fundamental.DividendYield }}
        </span>
      </el-row>
    </div>
    <el-table :data="results">
      <el-table-column prop="sma" label="SMA">
        <template #default="scope">
          <el-tooltip
            content="SMA (Média Móvel Simples): Média de preços em um período específico. Utilizado para identificar tendências"
            placement="top">
            <div>{{ scope.row.sma }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="macd" label="MACD">
        <template #default="scope">
          <el-tooltip placement="top"
            content="MACD (Convergência/Divergência de Média Móvel): Utilizado para identificar possíveis pontos de reversão no preço dos ativos">
            <div>{{ scope.row.macd }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="rsi" label="RSI">
        <template #default="scope">
          <el-tooltip placement="top"
            content="RSI (Índice de Força Relativa): Mede velocidade e mudança de movimentos de preço. Valores acima de 70 são considerados sobrecomprados e abaixo de 30, sobrevendidos">
            <div>{{ scope.row.rsi }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="atr" label="ATR">
        <template #default="scope">
          <el-tooltip placement="top"
            content="ATR (Alcance Médio Verdadeiro): Mede a volatilidade do ativo. Quanto maior o ATR, mais volátil é o ativo.">
            <div>
              {{ scope.row.atr }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="bbands" label="BBANDS">
        <template #default="scope">
          <el-tooltip placement="top"
            content="BBANDS (Bandas de Bollinger): Compostas por uma média móvel (banda do meio) e duas bandas externas que são desvios padrão da banda do meio. Utilizado para medir volatilidade e identificar 'sobrecompra' ou 'sobrevenda">
            <div>{{ scope.row.bbands }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="adx" label="ADX">
        <template #default="scope">
          <el-tooltip
            content="ADX (Índice de Direção Média): Mede a força de uma tendência. Valores acima de 25 indicam uma tendência forte"
            placement="top">
            <div>{{ scope.row.adx }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<style lang="scss" scoped>
.el-card.card-stock-data {
  background: white;

  margin: 8px;
  max-width: 40vh;

  .box{
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 8px;
    margin: 8px;
    text-align: center;
    padding: 0;
    width: auto;
    div {
      padding: 4px;
      background: rgb(99, 99, 99);
      color: white;
      font-size: 12px;
    }
  }

  #status {
    height: auto;
    width: auto;
    border-radius: 10%;
    margin-right: 8px;
    padding: 4px;
    color: white;
  }
}
</style>