<script setup lang="ts">
import { ref } from 'vue';
import ChartCategory from './components/ChartCategory.vue';
import ChartInvestments from './components/ChartInvestments.vue';
import ChartTransactions from './components/ChartTransactions.vue';
import GroupCards from './components/GroupCards.vue';
import HeaderView from './components/HeaderView.vue'
import ReccurentBills from './components/ReccurentBills.vue';
import TableTopStocks from './components/TableTopStocks.vue';
import TableTransactions from './components/TableTransactions.vue';

const activeTab = ref();
const TABS = {
  CASH_FLOW: 0,
  INVESTMENTS: '1'
}

</script>
<template>
  <el-card id="body">
    <HeaderView :title="'Relatório de Gastos'"/>
    <hr/>
    <el-main>
      <!-- el-tabs investment and debt -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Fluxo de caixa">
          <el-row :gutter="10">
            <el-col :span="5">
              <ReccurentBills />
            </el-col>
            <el-col :span="11">
              <ChartTransactions />
            </el-col>
            <el-col :span="8">
              <ChartCategory />
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <TableTransactions />
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="Investimentos">
          <div v-if="activeTab === TABS.INVESTMENTS">
            <el-row>
              <GroupCards />
            </el-row>
            <el-row :gutter="10" style="margin-top: 8px">
              <el-col :span="12">
                <TableTopStocks />
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-card>
  hello world
</template>

<style lang="scss" scoped>
#body{
  margin: 30px 10px;
  max-width: 1280px;
}
.el-card{
  border-radius: 5px;
  background: rgba(244, 245, 240, 1);
  background: linear-gradient(0deg, #f0f0ef 0%, #f0efef 100%);
}

// set var --el-color-primary to greens
</style>s
