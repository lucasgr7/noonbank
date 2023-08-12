<script lang="ts" setup>

import { computed, onMounted, ref } from 'vue';
import { supabase } from '../composables/supabase';

const transactions = ref([] as any[]);
const pageSize = ref(10);
const currentPage = ref(1);
const totalTransactions = ref(0);

function handleSizeChange(newSize: number) {
  pageSize.value = newSize;
  currentPage.value = 1; // Reset to first page when page size changes
  fetch();
}
function handleCurrentChange(newPage: number) {
  currentPage.value = newPage;
  fetch();
}


const fetchTotalCount = async () => {
  const { count } = await supabase
    .from('transactions')
    .select('*', { count: 'exact' });
  totalTransactions.value = count || 0;
};

const fetch = async () => {
  const table = 'transactions';
  const { data } = await supabase
    .from(table)
    .select('*')
    .order('time', { ascending: false })
    .range((currentPage.value - 1) * pageSize.value, pageSize.value * (currentPage.value - 1) + pageSize.value -1);
  transactions.value = transform(data);

  // Fetch total count if needed (only once or when data changes)
  if (totalTransactions.value === 0) {
    fetchTotalCount();
  }
};

const transform = (data: any) => {
  return data.map((item: any) => {
    return {
      ...item,
      amount: (item.amount / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      time: new Date(item.time).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
    };
  });
};

onMounted(async () => {
  await fetch();
  await fetchTotalCount();
})

</script>
<template>
    <h3>Transações</h3>
    <el-table id="table-transactions" :data="transactions" style="width: 100%" >
    <el-table-column prop="description" label="Description"></el-table-column>
    <el-table-column prop="amount" label="Amount"></el-table-column>
    <el-table-column prop="title" label="Title"></el-table-column>
    <el-table-column prop="time" label="Time"></el-table-column>
  </el-table>

  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalTransactions">
    </el-pagination>
</template>
<style lang="scss" scoped>
  #transactions-table {
    /* From https://css.glass */
    background: rgba(111, 224, 255, 0.61);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(9.2px);
    -webkit-backdrop-filter: blur(9.2px);
    border: 1px solid rgba(111, 224, 255, 0.37);
  }
</style>
