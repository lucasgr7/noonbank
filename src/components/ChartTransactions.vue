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
import { ref, provide, computed } from 'vue';
import { useMergeTransaction } from '../composables/useMergeTransaction';
import Noonlabel from './Noonlabel.vue';
import { processor } from '../services/transactionsProcessor';

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

// process the data to show
processor(totalGain, totalCost, dateRange, mergeData, options)

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
