<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const emits = defineEmits(['date-range-changed']);
// Initial Slider Value
const sliderValue = ref([15, 20]);

// Function to format slider value to month
const formatMonth = (value: any, first: boolean, raw: boolean = false) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (20 - value));
  if(first){
    date.setDate(1);
  }
  if(raw){
    return date;
  }
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

// Function to emit selected date range
const updateDates = () => {
  const startDate = formatMonth(sliderValue.value[0], true, true);
  const endDate = formatMonth(sliderValue.value[1], false, true);
  emits('date-range-changed', { startDate, endDate }, sliderValue.value);
};

const marks = ref({
  0: '20 meses',
  5: '15 meses',
  15: '5 meses atrás',
  20: {
    style: {
      color: 'green',
    },
    label: 'Hoje',
  },
});

onMounted(() => {
  updateDates();
})
</script>

<template>
  <div>
    <el-slider
      v-model="sliderValue"
      :min="0"
      :max="20"
      range
      :step="1"
      :marks="marks"
      @change="updateDates"
    >
      <template #tooltip="{ value }">
        <div>{{ formatMonth(value, true) }}</div>
      </template>
    </el-slider>
  </div>
</template>
<style lang="scss" scoped>

</style>