<script setup lang="ts">
import CategoryTag from './components/CategoryTag.vue';
import ChartCategory from './components/ChartCategory.vue';
import ChartTransactions from './components/ChartTransactions.vue';
import HeaderView from './components/HeaderView.vue'
import TableTransactions from './components/TableTransactions.vue';

</script>

<template>
  <el-card id="body">
    <HeaderView :title="'Relatório de Gastos'"/>
    <hr/>
    <el-main>
      <el-row :gutter="40">
        <el-col :span="14">
          <ChartTransactions />
        </el-col>
        <el-col :span="10">
          <ChartCategory />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
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
