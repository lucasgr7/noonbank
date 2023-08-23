<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const emits = defineEmits(['date-range-changed']);
// Initial Slider Value
const sliderValue = ref([15, 20]);

// Function to format slider value to month
const formatMonth = (value: any, raw: boolean = false) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (20 - value));
  if(raw){
    return date;
  }
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

// Function to emit selected date range
const updateDates = () => {
  const startDate = formatMonth(sliderValue.value[0], true);
  const endDate = formatMonth(sliderValue.value[1], true);
  emits('date-range-changed', { startDate, endDate });
};

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
      step="1"
      @change="updateDates"
    >
      <template #tooltip="{ value }">
        <div>{{ formatMonth(value) }}</div>
      </template>
    </el-slider>
    <p>Selected Range: {{ formatMonth(sliderValue[0]) }} to {{ formatMonth(sliderValue[1]) }}</p>
  </div>
</template>
<style lang="scss" scoped>

</style>