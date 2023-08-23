<script lang="ts" setup>
import SliderDatePicker from './SliderDatePicker.vue';
import { CanvasRenderer } from 'echarts/renderers';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, computed } from 'vue';
import { useInvestments } from '../composables/useInvestments';
import { ChartOptionsBuilder, SimpleSeries, XAxis } from '../services/chartOptionsGenerator';

use([
  CanvasRenderer,
  LineChart,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
]);
provide(THEME_KEY, 'light');

const dateRange = ref(); // { "startDate": "March 2024", "endDate": "November 2024" }
const { investmentsSeries } = useInvestments(dateRange);


function handleDateChange(newDate: any) {
  dateRange.value = newDate;
}

const options = computed(() => {
  if(investmentsSeries.value.length === 0 ) return {};
  // agroup investmentSeries by name
  const series = investmentsSeries.value.reduce((acc, cur) => {
    const name = cur.name;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(cur);
    return acc;
  }, {} as any);

  // agoup dates
  const xAxisData = investmentsSeries.value.reduce((acc, cur) => {
    if (!acc.includes(cur.date)) {
      acc.push(cur.date);
    }
    return acc;
  }, [] as any).reverse();
  const xAxis = [{
    type: 'category',
    data: xAxisData,
    boundaryGap: false,
  }] as XAxis[];

  // using series key values aggroup the values of the array investimentSeries
  const legend = Object.keys(series);
  const seriesValues = legend.map((key) => {
    return {
      name: key,
      type: 'line',
      data: series[key].map((x: any) => x.closeValue).reverse(),
    };
  });
  console.log(seriesValues)
  return new ChartOptionsBuilder().buildLineChartOptions(
    'Investimentos',
    legend,
    xAxis,
    seriesValues
  )
}
);

</script>
<template>
  <h3>Investimentos</h3>
  <el-card>
    <el-header>
      <SliderDatePicker @date-range-changed="handleDateChange" />
    </el-header>
    <v-chart class="chart" :option="options" autoresize />
  </el-card>
</template>
<style lang="scss" scoped>
.el-card {
  background: white;
}
.chart {
  height: 50vh;
}
</style>