<script lang='ts' setup>
import { usePeriod } from '../composables/period';
import {
  Plus
} from '@element-plus/icons-vue'
import FormCreateTag from './FormCreateTag.vue';
import { ref } from 'vue';
import FormCreateStock from './FormCreateStock.vue';
import FormCreateAccountTransaction from './FormCreateAccountTransaction.vue';
import FormRecurrentBills from './FormRecurrentBills.vue';
import { useRecurrentBills } from '@renderer/composables/useRecurrentBills';
import { ElNotification } from 'element-plus';
import _ from 'lodash';
import { onMounted, onBeforeUnmount } from 'vue';


const { selectedMonth } = usePeriod();
const isFormCreateTag = ref(false);
const isFormCreateStock = ref(false);
const isFormCreateAccountTransaction = ref(false);
const isFormRecurrentBills = ref(false);

const props = defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  }
});

const { insertRecord, createId } = useRecurrentBills();
const form = ref({
  id: createId(),
  label: '',
  key: '',
});

function showCreateStock() {
  isFormCreateStock.value = true;
}
function showCreateCategory() {
  isFormCreateTag.value = true;
}
function showCreateAccountTransaction() {
  isFormCreateAccountTransaction.value = true;
}
function showCreateReccurentBills() {
  isFormRecurrentBills.value = true;
}
function closeCategory() {
  isFormCreateTag.value = false;
}
function closeStock() {
  isFormCreateStock.value = false;
}
function closeFormAccountTransaction(){
  isFormCreateAccountTransaction.value = false;
}
function closeFormRecurrentBills(){
  isFormRecurrentBills.value = false;
}
function handleRefresh(){
  // electron refresh
  window.location.reload();
}

async function handleCreate(){
  try {
    await insertRecord(form.value);
    ElNotification  ({
      title: 'Sucesso',
      message: 'Conta Recorrente criada com sucesso',
      type: 'success',
    });
  } catch (error: any) {
    if (_.isError(error))
      ElNotification({
        title: 'Error',
        message: error.message,
        type: 'error'
      });
  }

  closeFormRecurrentBills();
  handleRefresh();
}

function handleKeydown(e) {
  if (e.ctrlKey && e.key.toLowerCase() === 'i') {
    showCreateAccountTransaction();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <button type="button" class="round icon" @click="handleRefresh"><el-icon><Refresh /></el-icon></button>
  <FormCreateTag :visible="isFormCreateTag" @close="closeCategory" />
  <FormCreateStock :visible="isFormCreateStock" @close="closeStock" />
  <FormCreateAccountTransaction :visible="isFormCreateAccountTransaction" @close="closeFormAccountTransaction" />
  <FormRecurrentBills :visible="isFormRecurrentBills" :form="form" title="Nova Conta Recorrente" @close="closeFormRecurrentBills" @saveData="handleCreate"/>
    <el-row class="container" align="middle">
      <el-col :lg="6" :md="8" :sm="6" :xs="24">
        <h2 class="title">{{ props.title }}</h2>
      </el-col>
      <el-col :lg="5" :md="5" :sm="5" :xs="24">
        <el-date-picker v-model="selectedMonth" format="MM/YYYY" type="month" placeholder="Data" style="width: 100%;"/>
      </el-col>
      <el-col :offset="1" :lg="12" :md="10" :sm="10" :xs="24">
        <el-row class="icon_container" justify="center">
          <el-col :span="5">
            <el-button :icon="Plus" type="success" @click="showCreateCategory" round>
              Categoria
            </el-button>
          </el-col>
          <el-col :span="5">
            <el-button :icon="Plus" type="warning" @click="showCreateStock" round>
              Novo Ativo
            </el-button>
          </el-col>
          <el-col :span="7">
            <el-button :icon="Plus" type="danger" @click="showCreateAccountTransaction" round>
              Nova Transação
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button :icon="Plus" type="success" @click="showCreateReccurentBills" round>
              Conta Recorrente
            </el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
</template>

<style scoped lang='scss'>
.container {
  width: 100%;
  padding: 0px 20px;
  height: 9vh;

  border-radius: 5px;
}

.title {
  color: rgba(48, 48, 48, 1);
  font-weight: 400;
  font-size: 32px;
}

.circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 31px;
  height: 31px;
  background: rgba(255, 255, 255, 1);
  border-radius: 50%;
  margin-left: 25px;
  cursor: pointer;
}

.round.icon{
  border-radius: 50%;
  background: rgba(255, 255, 255, 1);
  border: none;
  cursor: pointer;
  padding: 0px;
  width: 31px;
  height: 31px;
  margin-left: 25px;
  .el-icon{
    font-size: 16px;
    padding: 0px;
  }
  // animate when hover to spin
  &:hover{
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
      }
  }
}

@media screen and (max-width: 767px) {

  .container{
    text-align: center;
  }
  .icon_container {
    display: flex;
    justify-content: space-evenly;
    margin-top: 20px;
  }
}

</style>
