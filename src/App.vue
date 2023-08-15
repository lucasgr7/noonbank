<script setup lang="ts">
import ChartTransactions from './components/ChartTransactions.vue';
import HeaderView from './components/HeaderView.vue'
import TableTransactions from './components/TableTransactions.vue';
import { usePeriod } from './composables/period';

</script>

<template>
  <el-card id="body">
    <HeaderView :title="'Relatório de Gastos'"/>
    <hr/>
    <el-main>
      <el-row>
        <el-col :span="14">
          <ChartTransactions />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <TableTransactions />
        </el-col>
      </el-row>
    </el-main>
  </el-card>
</template>

<style scoped>
#body{
  margin: 30px 10px;
}
  .el-card{
    border-radius: 5px;
    background: rgba(244, 245, 240, 1);
    background: linear-gradient(0deg, rgb(213, 214, 207) 0%, rgba(244, 245, 240, 1) 100%);
  }
</style>s
