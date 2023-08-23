<script lang="ts" setup>
import { onMounted } from 'vue';
import { useStock } from '../composables/useStock';

const { getRecords, records } = useStock();

onMounted(() =>{
  getRecords();
})
</script>
<template>
  <!-- create an el-table on the base of Stock -->
  <el-table :data="records">
    <el-table-column prop="symbol" label="Símbolo"></el-table-column>
    <el-table-column prop="quantity" label="Quantidade"></el-table-column>
    <el-table-column prop="investment_type" label="Tipo"></el-table-column>
  </el-table>
</template>