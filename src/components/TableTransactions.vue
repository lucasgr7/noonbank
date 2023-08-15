<script lang="ts" setup>

import { computed, onMounted, ref } from 'vue';
import { usePeriod } from '../composables/period';
import { useMergeTransaction } from '../composables/useMergeTransaction';
import { moneyFormatter, timeFormatter } from '../helper';

const { dates } = usePeriod();
const { mergeData, accTransactions, totalAccTransactions, totalTransactions } = useMergeTransaction(dates);

const pageSize = ref(10);
const currentPage = ref(1);
// Sorting column reference
const sortingColumn = ref({
  order: 'descending', // or 'descending'
  prop: 'time', // property to sort by
});

function handleSizeChange(newSize: number) {
  pageSize.value = newSize;
  currentPage.value = 1; // Reset to first page when page size changes
}
function handleCurrentChange(newPage: number) {
  currentPage.value = newPage;
}
function columnSort({prop, order}: any) {
  sortingColumn.value = { prop, order };
}

const chunckedData = computed(() => {
  const { order, prop } = sortingColumn.value;
  
  // Sort the data based on the specified column and order
  let sortedData = mergeData.value;
  if (prop && order) {
    sortedData.sort((a, b) => {
      if (order === 'ascending') {
        return a[prop] > b[prop] ? 1 : -1;
      } else if (order === 'descending') {
        return a[prop] < b[prop] ? 1 : -1;
      }
      return 0;
    });
  }

  // Chunk the sorted data based on the current page and page size
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return sortedData.slice(start, end);
});



onMounted(() => {
  console.log(accTransactions.value, totalAccTransactions.value);
})

</script>
<template>
  <h3>Transações</h3>
  <el-table id="table-transactions" @sort-change="columnSort" :data="chunckedData" style="width: 100%">
    <el-table-column sortable prop="type" label="Tipo" :width="50"></el-table-column>
    <el-table-column sortable prop="description" label="Description" :width="400"></el-table-column>
    <el-table-column sortable prop="amount" :formatter="moneyFormatter" label="Amount"></el-table-column>
    <el-table-column sortable prop="cateogry" label="Category"></el-table-column>
    <el-table-column sortable prop="time" label="Time" :formatter="timeFormatter"></el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
    :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
    :total="totalTransactions + totalAccTransactions">
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
