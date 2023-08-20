<script lang="ts" setup>
import { onMounted } from 'vue';
import { useStock } from '../composables/useStock';

const { getStocks, stocks } = useStock();

onMounted(() =>{
  getStocks();
})
</script>
<template>
  <!-- create an el-table on the base of Stock -->
  <el-table :data="stocks">
    <el-table-column prop="symbol" label="Símbolo"></el-table-column>
    <el-table-column prop="quantity" label="Quantidade"></el-table-column>
    <el-table-column prop="investment_type" label="Tipo"></el-table-column>
  </el-table>
</template>