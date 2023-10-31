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
const mergeData = inject("mergeData") as Ref<TypeMergeData[]>;

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  ToolboxComponent,
]);
provide(THEME_KEY, "light");

const props = defineProps({
  categories: {
    type: Array as () => Category[],
    required: true,
  },
});

const option = ref();
const visible = ref(false);

function handleVisible() {
  visible.value = !visible.value;
  render();
}

defineExpose({
  handleVisible,
});

function render() {
  debugger;
  let dataByMonth: any = {};
  let categories = new Set();
  if (mergeData.value == null) {
    console.error("mergeData is null");
    return;
  }

  // Step 1: Aggregate data by month and category
  mergeData.value.forEach((transaction: TypeMergeData) => {
    const date = new Date(transaction.time);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    const labelCategory = props.categories.find(
      (category) => category.id === transaction.categoryId
    )?.name;

    if(labelCategory == null) return;

    if (!dataByMonth[month]) dataByMonth[month] = {};
    if (!dataByMonth[month][labelCategory ?? "none"])
      dataByMonth[month][labelCategory ?? "none"] = 0;
    dataByMonth[month][labelCategory ?? "none"] += transaction.amount;
    categories.add(labelCategory ?? "none");
  });

  // Step 2: Prepare chart series data
  let seriesData = Array.from(categories).map((category) => ({
    name: category,
    type: "bar",
    data: [],
  }));

  let trendLine = {
    name: "Trend",
    type: "line",
    data: [],
  };

  let xAxisData: any = [];

  // Limit to last 5 months
  let lastMonths = Object.keys(dataByMonth).sort();
  lastMonths.forEach((month) => {
    xAxisData.push(month);

    seriesData.forEach((series) => {
      series.data.push(dataByMonth[month][series.name] || 0);
    });
  });

  // Step 3: Trend line calculation (simplified)
  seriesData.forEach((series) => {
    let total = series.data.reduce((acc, val) => acc + val, 0);
    let avg = total / series.data.length;
    trendLine.data.push(avg);
  });

  // Step 4: Update ECharts option
  option.value = {
    tooltip: {
      /* your tooltip config */
    },
    toolbox: {
      /* your toolbox config */
    },
    legend: {
      data: [...categories, "Trend"],
    },
    xAxis: [
      {
        type: "category",
        data: xAxisData,
        axisPointer: {
          type: "shadow",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Spending",
      },
    ],
    series: [...seriesData, trendLine],
  };
}
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
