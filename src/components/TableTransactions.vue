<script lang="ts" setup>

import { computed, onMounted, ref } from 'vue';
import { usePeriod } from '../composables/period';
import { TypeMergeData, useMergeTransaction } from '../composables/useMergeTransaction';
import { moneyFormatter, timeFormatter } from '../helper';
import { useCategories } from '../composables/useCategories';
import { ElNotification } from 'element-plus';
import CategoryTag from './CategoryTag.vue';

const { dates } = usePeriod();
const { mergeData, accTransactions, totalAccTransactions, totalTransactions, updateAccountCategory, updateCreditCardCategory } = useMergeTransaction(dates);
const { getCategories, categories } = useCategories();

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
function columnSort({ prop, order }: any) {
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

function computedCss(form: any) {
  return {
    color: form.color_font,
    backgroundColor: form.background_color,
    border: `1px solid ${form.color_font}`,
    fontSize: '14px'
  }
}

function handleChangePrimaryCateogry(row: TypeMergeData) {
  // validate primaryCategory with notification
  if (!row.categoryId) {
    ElNotification({
      title: 'Error',
      message: 'Please select a category',
      type: 'error'
    });
  }
  try{
    if (row.type === 'credit') {
      updateCreditCardCategory(row);
    } else {
      updateAccountCategory(row);
    }
  }
  catch(error: any){
    ElNotification({
      title: 'Error',
      message: error.message,
      type: 'error'
    });
  }
}

onMounted(() => {
  console.log(accTransactions.value, totalAccTransactions.value);
  getCategories();
})

</script>
<template>
  <h3>Transações</h3>
  <el-table id="table-transactions" @sort-change="columnSort" :data="chunckedData" style="width: 100%">
    <el-table-column sortable prop="signal" label="Tipo" :width="50"></el-table-column>
    <el-table-column sortable prop="description" label="Description" :width="400"></el-table-column>
    <el-table-column sortable prop="amount" :formatter="moneyFormatter" label="Amount"></el-table-column>
    <el-table-column sortable prop="categoryId" label="Category">
      <template #default="scope">
        <el-select v-if="!scope.row.categoryId && scope.row.typeValue !== 'plus'" placeholder="Select Category"
          v-model="scope.row.categoryId" @change="handleChangePrimaryCateogry(scope.row)">
          <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id">
            <el-tag :style="computedCss(category)" class="tag">
              {{ category.name }}
            </el-tag>
          </el-option>
        </el-select>
        <span v-else>
          <CategoryTag v-if="scope.row.categoryId && (categories?.length ?? 0) > 0" :categories="categories" :id="scope.row.categoryId" />
        </span>
      </template>
    </el-table-column>
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
