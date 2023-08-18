<script lang="ts" setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, computed, watch } from 'vue';
import { useMergeTransaction } from '../composables/useMergeTransaction';
import Noonlabel from './Noonlabel.vue';

use([
  CanvasRenderer,
  LineChart,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
]);
provide(THEME_KEY, 'light');

const dateRange = ref([new Date(2023, 0, 1), new Date(2023, 11, 31)]);
const valueDate = computed(() => {
  return [
    dateRange.value[0].toISOString().slice(0, 10),
    dateRange.value[1].toISOString().slice(0, 10),
  ]
})
const { mergeData } = useMergeTransaction(valueDate);
const options = ref();
const totalGain = ref(0);
const totalCost = ref(0);

watch(() => mergeData.value, () => {
  if (mergeData.value?.length === 0) return;

  // reset variables
  totalGain.value = 0;
  totalCost.value = 0;

  const startDate = dateRange.value[0];
  const endDate = dateRange.value[1];
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay)) + 1;

  let xAxisData = [];
  let positiveData: any[] = [];
  let negativeData: any[] = [];


  if (diffDays <= 31) {
    // Group by days
    for (let i = 0; i < diffDays; i++) {
      const date = new Date(startDate.getTime() + i * oneDay);
      xAxisData.push(date.toISOString().slice(0, 10));
      positiveData.push(0);
      negativeData.push(0);
    }

    mergeData.value.forEach(item => {
      const dayIndex = Math.floor((item.time.getTime() - startDate.getTime()) / oneDay);
      if (dayIndex >= 0 && dayIndex < diffDays) {
        const amount = item.amount;
        if (item.typeValue === 'plus') {
          positiveData[dayIndex] += amount;
        } else if (item.typeValue === 'minus') {
          negativeData[dayIndex] += amount;
        }
      }
    });
  } else {
    // Group by months dynamically based on the data
    let currentMonth = startDate.getMonth();
    let currentYear = startDate.getFullYear();
    let endYear = endDate.getFullYear();
    let endMonth = endDate.getMonth();

    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      xAxisData.push(new Date(currentYear, currentMonth, 1).toLocaleString('en-us', { month: 'short' }));
      positiveData.push(0);
      negativeData.push(0);

      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }

    mergeData.value.forEach(item => {
      const monthIndex = (item.time.getFullYear() - startDate.getFullYear()) * 12 + (item.time.getMonth() - startDate.getMonth());
      const amount = item.amount; // Convert the amount to a number
      if (monthIndex >= 0 && monthIndex < xAxisData.length) {
        if (item.typeValue === 'plus') {
          positiveData[monthIndex] += amount;
        } else if (item.typeValue === 'minus') {
          negativeData[monthIndex] += amount;
        }
      }
    });
  }

  positiveData.map((item, index) => {
    positiveData[index] = parseFloat(item.toFixed(2));
    totalGain.value += parseFloat(item);
  })
  negativeData.map((item, index) => {
    negativeData[index] = parseFloat(item.toFixed(2));
    totalCost.value += parseFloat(item);
  })


  options.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['Ganhos', 'Gastos']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
      }
    ],
    yAxis: [
      {
        type: 'value',
      }
    ],
    series: [
      {
        name: 'Ganhos',
        type: 'line',
        areaStyle: {},
        color: 'green',
        emphasis: {
          focus: 'series',
        },
        data: positiveData,
      },
      {
        name: 'Gastos',
        type: 'line',
        color: 'red',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: negativeData,
      },
    ],
  }
})

// data

console.log(mergeData)

</script>
<template>
  <el-card>
    <el-header>
      <el-row justify="center">
        <el-date-picker type="daterange" v-model="dateRange" range-separator="to" start-placeholder="Start date"
          end-placeholder="End date" align="right" />
      </el-row>
    </el-header>
    <v-chart class="chart" :option="options" autoresize />
    <hr/>
    <el-row align="middle">
      <el-col :span="12">
        <el-row justify="center">
          <noonlabel label="Total Ganhos" :value="`R$ ${totalGain.toLocaleString('pt-BR')}`" />
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row justify="center">
          <noonlabel label="Total Gastos" :value="` R$ ${totalCost.toLocaleString('pt-BR')}`" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>
<style lang="scss" scoped>
.el-card {
  // background white gradient
  background: #fff !important;
}

.chart {
  height: 40vh;
  width: 100% auto;
}
</style>
