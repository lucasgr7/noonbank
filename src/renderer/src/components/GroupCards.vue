<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useStock } from '../composables/useStock';
import CardStockData from './CardStockData.vue';

const { getRecords, records } = useStock();

const data = computed(() => {
  // if record is brazillian_stock add .SAO
  if(!records.value){
    return [];
  }
  return records.value.map((x) => {
    if(x.investment_type === 'brazilian_stock'){
      return {
        ...x,
        symbol: `${x.symbol}.SAO`
      }
    }
    return x;
  });
})
onMounted(() => {
  getRecords();
})
</script>
<template>
  <div class="flex">
    <div v-for="(item) of data" :key="item.symbol">
      <CardStockData :title="item.symbol" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.flex{
  display: flex;
  flex-wrap: wrap;
}
</style>