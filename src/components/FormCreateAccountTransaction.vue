<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { AccountTransaction, useAcountTransactions } from '../composables/useAcountTransactions';
import SelectCategory from './SelectCategory.vue';
import { useCategories } from '../composables/useCategories';
import { ElNotification } from 'element-plus';
import _ from 'lodash';
const {categories, getCategories} = useCategories();

const { insertAccountTransanction } = useAcountTransactions(null);


const emits = defineEmits(['close']);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const isVisible = ref(false);
const CLEAN_STATE = {
  id: '',
  footer: '',
  title: '',
  postdate: new Date(),
  detail: '',
  amount: '',
  category_id: null
} as unknown as AccountTransaction;
watch(
  () => props.visible,
  (value) => {
    isVisible.value = value;
  },
);

const form = reactive(CLEAN_STATE)

// actions
function handleCategoryChange(categoryId: number){
  form.category_id = categoryId;
}

function handleClean() {
  form.amount = CLEAN_STATE.amount;
  form.category_id = CLEAN_STATE.category_id;
  form.detail = CLEAN_STATE.detail;
  form.postdate = CLEAN_STATE.postdate;
  form.title = CLEAN_STATE.title;
}

const save = () => {
  // format date to yyyy-mm-dd
  if(form.postdate == null){
    ElNotification({
      title: 'Error',
      message: 'Please select a date',
      type: 'error'
    });
    return;
  }
  // check if postdate is a Date
  if(_.isDate(form.postdate)){
    form.postdate = form.postdate.toISOString().split('T')[0];
  }
  if(_.isEmpty(form.postdate)){
    ElNotification({
      title: 'Error',
      message: 'Please select a date',
      type: 'error'
    });
    return;
  }
  const response = insertAccountTransanction(form);
  if(response){
    ElNotification({
      title: 'Success',
      message: 'Account transaction created',
      type: 'success'
    });
    emits('close');
    handleClean();

  }else{
    ElNotification({
      title: 'Error',
      message: 'Error creating account transaction',
      type: 'error'
    });
  }
}

onMounted(() => {
  getCategories();
})
</script>
<template>
<el-dialog :draggable="true" id="formCreateAccountTransaction" v-model="isVisible"
  @close="emits('close')">
  <el-form>
    <el-row justify="start">
      <el-col :span="7">
        <el-form-item label="Data">
          <el-date-picker v-model="form.postdate" type="date" placeholder="Selecione a data">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="14" :offset="1">
        <el-form-item label="Descrição">
          <el-input v-model="form.detail" placeholder="Descrição"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="Título">
          <el-select v-model="form.title">
            <el-option value="Transferência recebida">Transferência recebida</el-option>
            <el-option value="Transferência enviada">Transferência enviada</el-option>
            <el-option value="Pagamento efetuado">Pagamento efetuado</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" >
        <el-form-item label="Categoria">
          <SelectCategory :categories="categories" @change="handleCategoryChange" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" >
        <el-form-item label="Preço">
          <el-input type="number" v-model="form.amount" placeholder="Preço"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <template #footer>
    <el-button @click="handleClean">Limpar</el-button>
    <el-button type="primary" @click="save">Salvar</el-button>
  </template>
</el-dialog>
</template>