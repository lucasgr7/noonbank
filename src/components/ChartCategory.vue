<script lang="ts" setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, computed, watch } from 'vue';
import { TypeMergeData, useMergeTransaction } from '../composables/useMergeTransaction';
import { Category, useCategories } from '../composables/useCategories';
const { categories } = useCategories();

use([
  CanvasRenderer,
  PieChart,
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

watch(() => mergeData.value, () => {
  if(!categories.value || categories.value.length === 0) return;
  if (mergeData.value?.length === 0) return;
  // agroup mergeData.value by category_id
  const groupByCategory = mergeData.value.reduce((acc: any, cur: TypeMergeData) => {
    const { categoryId, amount } = cur;
    if (!categoryId) return acc;

    if (!acc[categoryId]) {
      console.log('new cateogry id', categoryId)
      console.log(acc)
      const categoryName: string = categories.value.find((category: Category) => category.id === categoryId)?.name;
      acc[categoryId] = {
        name: categoryName.toUpperCase(),
        value: amount,
      };
    } else {
      acc[categoryId].value += amount;
    }
    // convert acc who is a dict to a an array of object
    return acc;
  }, {});

  const categoriesChart = Object.values(groupByCategory);
  // map all values to be simple decimal
  categoriesChart.map((category: any) => {
    category.value = Number(category.value.toFixed(2));
  })


  options.value = {
    tooltip: {
      trigger: 'item',
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
    series: [
      {
        name: 'Categorias',
        type: 'pie',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: categoriesChart,
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
        <el-date-picker type="daterange" v-model="dateRange" range-separator="até" start-placeholder="Start date"
          end-placeholder="End date" align="right" />
      </el-row>
    </el-header>
    <v-chart class="chart" :option="options" autoresize />
  </el-card>
</template>
<style lang="scss" scoped>
.el-card {
  // background white gradient
  background: #fff !important;
}

.chart {
  height: 45vh;
  width: 100% auto;
}
</style>
e