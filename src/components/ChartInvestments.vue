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
MarkLineComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, computed, onMounted } from 'vue';
import { useInvestments } from '../composables/useInvestments';
import { ChartOptionsBuilder, XAxis } from '../services/chartOptionsGenerator';
import { investments_manual, useManualinvestments } from '../composables/useManualinvestments';

use([
  CanvasRenderer,
  LineChart,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  MarkLineComponent
]);
provide(THEME_KEY, 'light');

const dateRange = ref(); // { "startDate": "March 2024", "endDate": "November 2024" }
const rangeDistance = ref(0);
const { investmentsSeries } = useInvestments(dateRange);
const { records, getRecords } = useManualinvestments();


function handleDateChange(newDate: any, sliderValue: any) {
  dateRange.value = newDate;
  rangeDistance.value = sliderValue[1] - sliderValue[0];
}

const options = computed(() => {
  if (investmentsSeries.value.length === 0) return {};

  // substring all objects date to be substring 0 - 5
  investmentsSeries.value.forEach((x: any) => {
    x.date = x.date.substring(0, 7);
  });
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
  records.value?.forEach((x: investments_manual) => {
    seriesValues.push({
      name: x.name ?? 'sem definição',
      type: 'line',
      // create n (rangeDistance.value) times the x.value
      data: Array.from({ length: rangeDistance.value + 1}, () => x.value),
    })
  })
  console.log(seriesValues)
  return new ChartOptionsBuilder().buildLineChartOptions(
    'Investimentos',
    legend,
    xAxis,
    seriesValues
  )
});
onMounted(() => {
  getRecords();
})
</script>
<template>
  <h3>Investimentos</h3>
  <el-card>
    <el-header>
      <SliderDatePicker @date-range-changed="handleDateChange" />
    </el-header>
    <div style="margin-top: 24px">
      <v-chart class="chart" :option="options" autoresize />
    </div>
  </el-card>
</template>
<style lang="scss" scoped>
.el-card {
  background: white;
}

.chart {
  height: 50vh;
  width: 100% auto;
}
</style>