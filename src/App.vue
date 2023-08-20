<script setup lang="ts">
import ChartCategory from './components/ChartCategory.vue';
import ChartTransactions from './components/ChartTransactions.vue';
import HeaderView from './components/HeaderView.vue'
import ReccurentDebts from './components/ReccurentDebts.vue';
import TableStocks from './components/TableStocks.vue';
import TableTransactions from './components/TableTransactions.vue';

</script>

<template>
  <el-card id="body">
    <HeaderView :title="'Relatório de Gastos'"/>
    <hr/>
    <el-main>
      <!-- el-tabs investment and debt -->
      <el-tabs>
        <el-tab-pane label="Fluxo de caixa">
          <el-row :gutter="10">
            <el-col :span="5">
              <ReccurentDebts />
            </el-col>
            <el-col :span="11">
              <ChartTransactions />
            </el-col>
            <el-col :span="8">
              <ChartCategory />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <TableTransactions />
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="Investimentos">
          <el-row>
            <el-col :span="24">
              <TableStocks />
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-card>
</template>

<style lang="scss" scoped>
#body{
  margin: 30px 10px;
  max-width: 1280px;
}
.el-card{
  border-radius: 5px;
  background: rgba(244, 245, 240, 1);
  background: linear-gradient(0deg, rgb(213, 214, 207) 0%, rgba(244, 245, 240, 1) 100%);
}

// set var --el-color-primary to greens
</style>s
