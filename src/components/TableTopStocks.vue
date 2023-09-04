<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { StockTopGainersAndLosers, getTopGainersAndLosers } from '../services/alhpaVantage';
import { useTable } from '../composables/useTable';
import TableFooter from './TableFooter.vue';
import Tableheader from './Tableheader.vue';


const data = ref({} as StockTopGainersAndLosers);

const records = computed(() => {
  if(data.value == null || data.value.top_gainers == null || data.value.top_losers == null || data.value.most_actively_traded == null){
    return [];
  }
  let allResults = data.value.top_gainers.map((x) => {
    return {
      ...x,
      type: '🔼' }
  });
  // concat with the emoji down for top_losers
  allResults = allResults.concat(data.value.top_losers.map((x) => {
    return {
      ...x,
      type: '🔽' }
  }));
  // concat most active trade
  allResults = allResults.concat(data.value.most_actively_traded.map((x) => {
    return {
      ...x,
      type: '↔️' }
  }));
  return allResults;
})

const { columnSort, 
  currentPage, 
  pageSize, 
  handleSizeChange, 
  handleCurrentChange, 
  handleSearch,
  chunckedData } = useTable(records, 'description');

onMounted(async () => {
  data.value = await getTopGainersAndLosers();
})
</script>
<template>
  <Tableheader title="Top Ações" @change="handleSearch" />
  <el-table :data="chunckedData" @sort-change="columnSort">
    <el-table-column sortable prop="type" label="Tipo"></el-table-column>
    <el-table-column sortable prop="ticker" label="Símbolo"></el-table-column>
    <el-table-column sortable prop="price" label="Preço"></el-table-column>
    <el-table-column sortable prop="change_percentage" label="Variação"></el-table-column>
    <el-table-column sortable prop="volume" label="Volume"></el-table-column>
  </el-table>
  <TableFooter 
    @current-change="handleCurrentChange" 
    @size-change="handleSizeChange" 
    :total="records.length" 
    :page-size="pageSize" 
    :current-page="currentPage" />
</template>