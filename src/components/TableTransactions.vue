  <script lang="ts" setup>

import { computed, onMounted, ref } from 'vue';
import { usePeriod } from '../composables/period';
import { TypeMergeData, useMergeTransaction } from '../composables/useMergeTransaction';
import { moneyFormatter, timeFormatter } from '../helper';
import { useCategories } from '../composables/useCategories';
import { ElNotification } from 'element-plus';
import CategoryTag from './CategoryTag.vue';
import { useTable } from '../composables/useTable';
import Tableheader from './Tableheader.vue';
import TableFooter from './TableFooter.vue';

const { dates } = usePeriod();
const { mergeData, totalAccTransactions, totalTransactions, updateAccountCategory, updateCreditCardCategory } = useMergeTransaction(dates);
const { getCategories, categories } = useCategories();

const { columnSort, 
  currentPage, 
  pageSize, 
  handleSizeChange, 
  handleCurrentChange, 
  handleSearch,
  chunckedData } = useTable(mergeData, 'description');


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

function handleClearCategory(row: TypeMergeData){
  row.categoryId = null;
}

onMounted(() => {
  getCategories();
})

</script>
<template>
  <Tableheader title="Trançasões" @change="handleSearch" />
  <el-table id="table-transactions" @sort-change="columnSort" :data="chunckedData" style="width: 100%">
    <el-table-column sortable prop="signal" label="Tipo" :width="50"></el-table-column>
    <el-table-column sortable prop="description" label="Description" :width="300"></el-table-column>
    <el-table-column sortable prop="amount" :formatter="moneyFormatter" :width="100" label="Amount"></el-table-column>
    <el-table-column sortable prop="categoryId" label="Category" :width="130">
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
          <CategoryTag v-if="scope.row.categoryId && (categories?.length ?? 0) > 0" :categories="categories" @click="handleClearCategory(scope.row)" :id="scope.row.categoryId" />
        </span>
      </template>
    </el-table-column>
    <el-table-column sortable prop="time" label="Time" :formatter="timeFormatter"></el-table-column>
  </el-table>
  <TableFooter 
    @current-change="handleCurrentChange" 
    @size-change="handleSizeChange" 
    :total="totalTransactions + totalAccTransactions"
    :page-size="pageSize" 
    :current-page="currentPage" />

</template>
<style lang="scss">
#transactions-table {
  /* From https://css.glass */
  background: rgba(111, 224, 255, 0.61);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(9.2px);
  -webkit-backdrop-filter: blur(9.2px);
  border: 1px solid rgba(111, 224, 255, 0.37);
}
  .paginator{
    margin-top: 8px;
    button {
        // round
        border-radius: 50% !important;
        // size
        width: 30px;
        height: 30px;
        margin-right: 4px;
    }
    ul.el-pager{
      height: 8vh;
      li {
        // round
        border-radius: 50% !important;
        // size
        width: 30px;
        height: 30px;
        margin-right: 4px;
        // dropshadow
        box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.1);
      }
    }
  }
</style>