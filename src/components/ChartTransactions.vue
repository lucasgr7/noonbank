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
import { processor } from '../services/transactionsProcessor';
import SliderDatePicker from './SliderDatePicker.vue';

use([
  CanvasRenderer,
  LineChart,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
]);
provide(THEME_KEY, 'light');

const dateRange = ref();
const { mergeData } = useMergeTransaction(dateRange);
const options = ref();
const totalGain = ref(0);
const totalCost = ref(0);

function handleDateChange(newDate: any) {
  dateRange.value = newDate;
}

// process the data to show
processor(totalGain, totalCost, dateRange, mergeData, options)
watch(() => options.value, (options: any) => console.info('transaction ', options));

</script>
<template>
  <el-card>
    <el-header>
      <slider-date-picker @date-range-changed="handleDateChange" />
    </el-header>
    <v-chart class="chart" :option="options" autoresize />
    <hr />
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
