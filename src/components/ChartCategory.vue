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
import { ref, provide, watch } from 'vue';
import { TypeMergeData, useMergeTransaction } from '../composables/useMergeTransaction';
import { Category, useCategories } from '../composables/useCategories';
import SliderDatePicker from './SliderDatePicker.vue';
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

const dateRange = ref();
const { mergeData } = useMergeTransaction(dateRange);
const options = ref();

watch(() => mergeData.value, () => {
  if(!categories.value || categories.value.length === 0) return;
  if (mergeData.value?.length === 0) return;
  // agroup mergeData.value by category_id
  const groupByCategory = mergeData.value.reduce((acc: any, cur: TypeMergeData) => {
    const { categoryId, amount } = cur;
    if (!categoryId) return acc;

    if (!acc[categoryId]) {
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
  categoriesChart.forEach((category: any) => {
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
      background: null,
      containLabel: true
    },
    series: [
      {
        name: 'Categorias',
        type: 'pie',
        radius: ['50%', '70%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#f0efef',
          borderWidth: 2
        },
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
});


function handleDateChange(newDate: any) {
  dateRange.value = newDate;
}

</script>
<template>
  <el-card style="border-radius: 50%; border-radius: 38px; height: 10vh; box-shadow: none;">
    <el-header>
      <slider-date-picker @date-range-changed="handleDateChange" />
    </el-header>
  </el-card>
    <v-chart class="chart" :option="options" autoresize />
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