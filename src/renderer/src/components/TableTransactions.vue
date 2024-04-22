<script lang="ts" setup>
import EditTransactionDialog from './EditTransactionDialog.vue';
import { onMounted, ref } from 'vue';
import { usePeriod } from '../composables/period';
import { TypeMergeData, useMergeTransaction } from '../composables/useMergeTransaction';
import { moneyFormatter, timeFormatter } from '../helper';
import { useCategories } from '../composables/useCategories';
import { ElNotification } from 'element-plus';
import CategoryTag from './CategoryTag.vue';
import { useTable } from '../composables/useTable';
import Tableheader from './Tableheader.vue';
import TableFooter from './TableFooter.vue';
import _ from 'lodash';
import SelectCategory from './SelectCategory.vue';

const { dates } = usePeriod();
const { mergeData,
  updateAccountCategory,
  updateCreditCardCategory,
  search } = useMergeTransaction(dates);
const { getCategories, categories } = useCategories();

const { columnSort,
  handleSizeChange,
  handleCurrentChange,
  currentPage,
  pageSize,
  totalCost,
  totalGain,
  totalNumerOfLines,
  chunckedData } = useTable(mergeData, 'description', true);
  
const isEditDialogVisible = ref(false);
const selectedRowData = ref({} as TypeMergeData);

function handleChangePrimaryCateogry(selectedCategory: number, row: TypeMergeData) {
  // validate primaryCategory with notification
  if (!selectedCategory) {
    ElNotification({
      title: 'Error',
      message: 'Please select a category',
      type: 'error'
    });
  }

  row.categoryId = selectedCategory;
  try {
    if (row.type === 'credit') {
      updateCreditCardCategory(row);
    } else {
      updateAccountCategory(row);
    }
  }
  catch (error: unknown) {
    if (_.isError(error))
      ElNotification({
        title: 'Error',
        message: error.message,
        type: 'error'
      });
  }
}

function handleSearch(query: string) {
  search(query);
}

function handleClearCategory(row: TypeMergeData) {
  row.categoryId = null;
}

onMounted(() => {
  getCategories();
})

//FOR EDIT DIALOG
function editTransaction(row: TypeMergeData) {
  selectedRowData.value = row;
  isEditDialogVisible.value = true;
}

async function updateTransaction(form: TypeMergeData) {
  try {
    if (form.type === 'credit') {
      selectedRowData.value.categoryId = form.categoryId;
      selectedRowData.value.description = form.description;
      await updateCreditCardCategory(form);
    } else {
      selectedRowData.value.categoryId = form.categoryId;
      selectedRowData.value.description = form.description;
      selectedRowData.value.amount = form.amount;
      await updateAccountCategory(form);
    }
  }
  catch (error: unknown) {
    if (_.isError(error))
      ElNotification({
        title: 'Error',
        message: error.message,
        type: 'error'
      });
      isEditDialogVisible.value = false;
      return;
    }
    
    ElNotification({
      title: 'Success',
      message: 'Transação Alterada com Sucesso!',
      type: 'success'
    });

    isEditDialogVisible.value = false;
    search('');
}

</script>
<template>
  <Tableheader title="Transações" @search="handleSearch" />
  <el-table id="table-transactions" @sort-change="columnSort" @row-click="editTransaction" :data="chunckedData"
    style="width: 100%" class="table">
    <el-table-column sortable prop="signal" label="Tipo" :width="70"></el-table-column>
    <el-table-column sortable prop="description" label="Descrição" :width="300"></el-table-column>
    <el-table-column sortable prop="amount" :formatter="moneyFormatter" :width="100" label="Montante"></el-table-column>
    <el-table-column sortable prop="categoryId" label="Categoria" :width="130">
      <template #default="scope">
        <SelectCategory v-if="!scope.row.categoryId && scope.row.typeValue !== 'plus'" :categories="categories"
          @change="(evt) => handleChangePrimaryCateogry(evt, scope.row)" />
        <span v-else>
          <CategoryTag v-if="scope.row.categoryId && (categories?.length ?? 0) > 0" :categories="categories"
            @click="handleClearCategory(scope.row)" :id="scope.row.categoryId" />
        </span>
      </template>
    </el-table-column>
    <el-table-column sortable prop="time" label="Data" :formatter="timeFormatter"></el-table-column>
  </el-table>
  <EditTransactionDialog v-model="isEditDialogVisible" :form="selectedRowData" title="Editar Transação"
    :isEditDialog="true" :isCreditTransaction="selectedRowData.type === 'credit'"
    @save="updateTransaction(selectedRowData)" @close-dialog="isEditDialogVisible = false" />
  <el-row>
    <el-col>
      Total gasto: {{ totalCost.toLocaleString('currency') }}
    </el-col>
    <el-col>
      Total ganho: {{ totalGain.toLocaleString('currency') }}
    </el-col>
  </el-row>
  <TableFooter @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="totalNumerOfLines"
    :page-size="pageSize" :current-page="currentPage" />

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

.table:hover {
  cursor: pointer;
}

.paginator {
  margin-top: 8px;

  button {
    // round
    border-radius: 50% !important;
    // size
    width: 30px;
    height: 30px;
    margin-right: 4px;
  }

  ul.el-pager {
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