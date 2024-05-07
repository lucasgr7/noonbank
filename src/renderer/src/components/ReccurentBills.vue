<script lang="ts" setup>
import { Ref, computed, onMounted, ref, unref, watch } from 'vue';
import { useRecurrentBills } from '../composables/useRecurrentBills';
import { usePeriod } from '../composables/period';
import { useMergeTransaction } from '../composables/useMergeTransaction';
import { snapshot_recurrnt_bills, useSnapshotRecurrentBills } from '../composables/useSnapshotRecurrentBills';
import FormRecurrentBills from './FormRecurrentBills.vue';
import { ElNotification } from 'element-plus';
import _ from 'lodash';

const { insertRecord } = useSnapshotRecurrentBills();

const { dates, previousMonthDates } = usePeriod();
const { records, getRecords, deleteRecord, updateRecord } = useRecurrentBills();
const { mergeData } = useMergeTransaction(dates);
const { mergeData: previousMergeData } = useMergeTransaction(previousMonthDates);
const isDialogVisible = ref(false);
const selectedRow = ref({} as recurrentBillView);

interface recurrentBillView {
  label: string;
  value: number;
  paid: boolean;
  id: number;
  key: string;
}

const recurrentBills = computed(() => {
  if (!records.value || !previousMergeData) return [];

  const calcSum = (data: Ref | any, keys: string[]) => {
    // validate if data has value or not
    data = unref(data);
    return data.reduce((acc, item) => {
      for (const key of keys) {
        if (item.description.toLocaleLowerCase().includes(key)) {
          return acc + Number(item.amount);
        }
      }
      return acc;
    }, 0);
  };

  const result: recurrentBillView[] = records.value.map(record => {
    const keys = record.key.toLocaleLowerCase().split(',');
    const currentSum = calcSum(mergeData.value, keys);
    const previousSum = calcSum(previousMergeData, keys);
    // calculate the difference between current and previous month in percentual
    // if the currentSum is 0 then the difference is null

    const diff = currentSum === 0 ? null : _.round(((currentSum - previousSum) / currentSum) * 100);

    return {
      label: record.label,
      value: currentSum,
      difference: diff,
      paid: currentSum > 0,
      id: record.id,
      key: record.key,
    };
  });

  return result.sort((a, b) => a.label.localeCompare(b.label));
});

const total = computed(() => {
  if (!recurrentBills.value) return 0;
  return recurrentBills.value.length;
})
const totalPaid = computed(() => {
  if (!recurrentBills.value) return 0;
  return recurrentBills.value.filter((item) => item.paid).length;
})
const totalAmount = computed(() => {
  if (!recurrentBills.value) return 0;
  return recurrentBills.value.reduce((acc, item) => acc + item.value, 0);
})

function takeSnapshot() {
  try {
    recurrentBills.value.forEach((recurrentBill: recurrentBillView) => {
      const { value } = recurrentBill;
      const record = {
        date: dates.value.startDate,
        value: value,
        reccurent_id: recurrentBill.id,
      } as snapshot_recurrnt_bills;
      insertRecord(record);
    });
  } catch (error: any) {
    console.error(error);
  }
}

function handleRowClick(row: recurrentBillView) {
  isDialogVisible.value = true;
  selectedRow.value = row;
}

onMounted(() => {
  getRecords();
})

async function handleUpdate(form: any) {
  try {
    const record = {
      id: form.id,
      label: form.label,
      key: form.key,
    }
    await updateRecord(form.id, record);
  } catch (error: any) {
    if (_.isError(error))
      ElNotification({
        title: 'Error',
        message: error.message,
        type: 'error'
      });
    isDialogVisible.value = false;
    return;
  }

  ElNotification({
    title: 'Sucesso',
    message: 'Conta Recorrente atualizada com sucesso',
    type: 'success',
  });

  isDialogVisible.value = false;
  getRecords();
}

async function handleDelete() {
  try {
    await deleteRecord(selectedRow.value.id);
  } catch (error: any) {
    if (_.isError(error))
      ElNotification({
        title: 'Error',
        message: error.message,
        type: 'error'
      });
    isDialogVisible.value = false;
    return;
  }

  isDialogVisible.value = false;
  getRecords();

  ElNotification({
    title: 'Sucesso',
    message: 'Conta Recorrente deletada com sucesso',
    type: 'success',
  });
}

</script>
<template>
  <el-card id="recurrent-debts">
    <el-row justify="center">
      <el-icon class="camera-icon" @click="takeSnapshot">
        <Camera />
      </el-icon>
      <h1> <span class="color-dark">{{ totalPaid }}</span>/<span class="color-light">{{ total }}</span></h1>
    </el-row>
    <div class="total-amount">
      R$ {{ totalAmount.toLocaleString('pt-br', { minimumFractionDigits: 2 }) }}
    </div>
    <el-table :data="recurrentBills" class="table-recurrent-bills" @row-click="handleRowClick">
      <el-table-column prop="label" label="Descrição" width="90">
        <template #default="{ row }">
          <b :class="row.paid ? 'color-dark' : 'color-light'">{{ row.label }}</b>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="Valor" width="90">
        <template #default="{ row }">
          R$ {{ row.value.toLocaleString('pt-br', { minimumFractionDigits: 2 }) }}
        </template>
      </el-table-column>
      <el-table-column prop="paid" label="Pago" width="65">
        <template #default="{ row }">
          <b
            :class="{ 'f-green': row.difference < 0, 'f-red': row.difference > 0, 'hidden': row.difference === 0 || row.difference == null }">
            {{ row.difference }}%
          </b>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <FormRecurrentBills :visible="isDialogVisible" :form="selectedRow" :isEditDialog="true"
    title="Editar Conta Recorrente" @close="isDialogVisible = false" @saveData="handleUpdate(selectedRow)"
    @deleteData="handleDelete" />
</template>
<style lang="scss">
#recurrent-debts {
  background: white;
  overflow-y: auto;
  font-size: 12px !important;

  .f-green {
    color: #2a670c;
  }

  .f-red {
    color: #c4260a;
  }

  .hidden {
    visibility: hidden;
  }

  .el-card__body {
    padding-inline: 0px !important;

    .el-table__cell {
      padding: 0px !important;
      font-size: 12px !important;

      // text don't break line
      b {
        white-space: nowrap;
      }
    }
  }

  h1 {
    font-size: 55px;
    padding: 0;
    margin: 7px;
    color: #3f9614;
    font-weight: revert;
    margin: 0;
  }

  .circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .light {
    background: #dab68e;
  }

  .color-light {
    color: #dab68e;
  }

  .dark {
    background: #2a670c;
  }

  .color-dark {
    color: #2a670c;
  }

  .total-amount {
    // border top 2 px black
    border-top: 2px solid black;
    // align middle
    display: flex;
    align-items: center;
    justify-content: center;

  }

  .camera-icon>svg {
    position: absolute;
    margin-right: 6vh;
    padding: 1vh;
    background: rgb(144, 143, 143);
    border-radius: 50%;
    color: white;
    cursor: pointer;
  }

  .table-recurrent-bills {
    margin-top: 10px;

    :hover {
      cursor: pointer;
    }

    .el-table__header-wrapper {
      display: none;
    }

    .el-table__body-wrapper {
      max-height: 40vh;
      overflow-y: auto;
    }
  }
}
</style>