<script lang='ts' setup>
import { usePeriod } from '../composables/period';
import {
  Plus
} from '@element-plus/icons-vue'
import FormCreateTag from './FormCreateTag.vue';
import { ref } from 'vue';
import FormCreateStock from './FormCreateStock.vue';
import FormCreateAccountTransaction from './FormCreateAccountTransaction.vue';

const { selectedMonth } = usePeriod();
const isFormCreateTag = ref(false);
const isFormCreateStock = ref(false);
const isFormCreateAccountTransaction = ref(false);

const props = defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  }
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
function closeCategory() {
  isFormCreateTag.value = false;
}
function closeStock() {
  isFormCreateStock.value = false;
}
function closeFormAccountTransaction(){
  isFormCreateAccountTransaction.value = false;
}

</script>

<template>
  <FormCreateTag :visible="isFormCreateTag" @close="closeCategory" />
  <FormCreateStock :visible="isFormCreateStock" @close="closeStock" />
  <FormCreateAccountTransaction :visible="isFormCreateAccountTransaction" @close="closeFormAccountTransaction" />
    <el-row class="container" align="middle">
      <el-col :lg="8" :md="8" :sm="6" :xs="24">
        <h2 class="title">{{ props.title }}</h2>
      </el-col>
      <el-col :lg="6" :md="5" :sm="5" :xs="24">
        <el-date-picker v-model="selectedMonth" format="MM/YYYY" type="month" placeholder="Data" style="width: 100%;"/>
      </el-col>
      <el-col :lg="10" :md="10" :sm="10" :xs="24">
        <el-row class="icon_container" justify="center"> 
          <el-col :span="6">
            <el-button :icon="Plus" type="success" @click="showCreateCategory" round>
              Categoria
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button :icon="Plus" type="warning" @click="showCreateStock" round>
              Novo Ativo
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button :icon="Plus" type="danger" @click="showCreateAccountTransaction" round>
              Nova Transação
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