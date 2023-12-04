<script lang="ts" setup>
// Charts
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
// Vue
import {
  computed,
  defineExpose,
  inject,
  onMounted,
  provide,
  Ref,
  ref,
  watch,
} from "vue";

import { TypeMergeData } from "../composables/useMergeTransaction";
import { Category } from "../composables/useCategories";
import useMedianCategoryCosts from "../composables/useMedianCategoryCosts";
const mergeData = inject("mergeData") as Ref<TypeMergeData[]>;
const categories = inject("categories") as Ref<Category[]>;

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  ToolboxComponent,
]);
provide(THEME_KEY, "light");

const { render, option } = useMedianCategoryCosts(mergeData, categories);

const visible = ref(false);

function handleVisible() {
  visible.value = !visible.value;
  render();
}

defineExpose({
  handleVisible,
});

function handleClose() {
  visible.value = false;
  render();
}
</script>

<template>
  <el-dialog
    title="Median Category Costs"
    v-model="visible"
    width="90%"
    height="70%"
  >
    <el-row>
      <el-toggle
        v-model="visible"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="Show"
        inactive-text="Hide"
        @change="handleVisible"
      />
    </el-row>
    <v-chart class="chart" @closed="handleClose" :option="option" autoresize />
  </el-dialog>
</template>


<style lang="scss" scoped>
.chart {
  height: 45vh !important;
  width: 100% auto !important;
  background: white;
  backdrop-filter: blur(10px);
}
</style>

