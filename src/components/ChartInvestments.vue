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
import { ref, provide } from 'vue';
import { useInvestments } from '../composables/useInvestments';

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

const options = ref({
  title: {
    text: 'Stacked Area Chart'
  },
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
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
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
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      label: {
        show: true,
        position: 'top'
      },
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
});

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
  height: 47.5vh;
  width: 100% auto;
}
</style>