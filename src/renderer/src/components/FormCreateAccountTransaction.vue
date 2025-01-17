<script lang="ts" setup>
import { onMounted, unref, ref, watch } from 'vue';
import { AccountTransaction, useAcountTransactions } from '../composables/useAcountTransactions';
import SelectCategory from './SelectCategory.vue';
import { useCategories } from '../composables/useCategories';
import { ElNotification } from 'element-plus';
import _ from 'lodash';
const { categories, getCategories } = useCategories();

const { insertAccountTransanction } = useAcountTransactions(null);

const emits = defineEmits(['close']);
const pickDate = ref();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const isVisible = ref(false);
const CLEAN_STATE = {
  id: '',
  postdate: new Date(),
  title: '',
  detail: '',
  amount: '',
  method_payment: '',
  impact: '',
  recurrent: false,
  comments: '',
  footer: '',
} as unknown as AccountTransaction;

watch(
  () => props.visible,
  (value) => {
    isVisible.value = value;
  },
);

const resetCategory = ref(false);
const form = ref({...CLEAN_STATE});

// actions
function handleCategoryChange(categoryId: number) {
  form.value.category_id = categoryId;
}

function handleClean() {
  form.value.detail = CLEAN_STATE.detail;
  form.value.amount = CLEAN_STATE.amount;
  form.value.title = CLEAN_STATE.title;
  form.value.postdate = CLEAN_STATE.postdate;
  form.value.category_id = CLEAN_STATE.category_id;
  form.value.method_payment = CLEAN_STATE.method_payment;
  form.value.impact = CLEAN_STATE.impact;
  form.value.recurrent = CLEAN_STATE.recurrent;
  form.value.comments = CLEAN_STATE.comments;
  resetCategory.value = true;
}

const save =  async () => {
  // format date to yyyy-mm-dd
  if (form.value.postdate == null) {
    ElNotification({
      title: 'Error',
      message: 'Please select a date',
      type: 'error'
    });
    return;
  }
  // check if postdate is a Date
  if (_.isDate(form.value.postdate)) {
    form.value.postdate = form.value.postdate.toISOString().split('T')[0];
  }
  if (_.isEmpty(form.value.postdate)) {
    ElNotification({
      title: 'Error',
      message: 'Please select a date',
      type: 'error'
    });
    return;
  }
  const response = await insertAccountTransanction(unref(form));
  if (response.status === 201) {
    ElNotification({
      title: 'Success',
      message: 'Account transaction created',
      type: 'success'
    });
    handleClean();

  } else {
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
  <el-dialog :draggable="true" id="formCreateAccountTransaction" v-model="isVisible" title="Movimentação de Caixa"
    class="transaction-form" @close="emits('close')">
    <el-form>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-row>
            Data
          </el-row>
          <el-row>
            <el-form-item class="full-width">
              <el-date-picker ref="pickDate" v-model="form.postdate" type="date" placeholder="Selecione a data" format="DD/MM/YYYY"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            Entrada ou Saída
          </el-row>
          <el-row>
            <el-form-item class="full-width">
              <el-select v-model="form.title" class="full-width" placeholder="Selecione">
                <el-option label="Entrada" value="Transferência recebida"></el-option>
                <el-option label="Saída" value="Transferência enviada"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        Categoria
      </el-row>
      <el-row>
        <el-form-item class="full-width">
          <SelectCategory :categories="categories" @change="handleCategoryChange" :reset="resetCategory" 
          @resetDone="resetCategory = false" class="full-width" />
        </el-form-item>
      </el-row>
      <el-row>
        Descrição
      </el-row>
      <el-row>
        <el-form-item class="full-width">
          <el-input v-model="form.detail" placeholder="Descrição"></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-row>
            Preço
          </el-row>
          <el-row>
            <el-form-item class="full-width">
              <el-input type="number" v-model="form.amount" placeholder="R$"></el-input>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            Método de pagamento
          </el-row>
          <el-row>
            <el-form-item>
              <el-select v-model="form.method_payment" placeholder="Selecione">
                <el-option label="Crédito" value="crebito"></el-option>
                <el-option label="Débito" value="debito"></el-option>
                <el-option label="PIX" value="pix"></el-option>
                <el-option label="Boleto" value="boleto"></el-option>
                <el-option label="Saque" value="saque"></el-option>
                <el-option label="TED/DOC" value="ted/doc"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="20">
          <el-row>
            Impacto
          </el-row>
          <el-row>
            <el-form-item class="full-width">
              <el-select v-model="form.impact" placeholder="Selecione" class="full-width">
                <el-option label="Essencial" value="Essencial"></el-option>
                <el-option label="Não Essencial" value="Não Essencial"></el-option>
                <el-option label="Investimento" value="Investimento"></el-option>
                <el-option label="Luxo" value="Luxo"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="2">
          <el-row>
            Recorrente?
          </el-row>
          <el-row>
            <el-form-item>
              <el-checkbox v-model="form.recurrent"></el-checkbox>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        Comentários
      </el-row>
      <el-row>
        <el-form-item class="full-width">
          <el-input v-model="form.comments" placeholder="Comentários"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <el-row :gutter="6">
        <el-col :span="12">
          <el-button class="full-width" @click="handleClean">Limpar</el-button>
        </el-col>
        <el-col :span="12">
          <el-button class="full-width" type="primary" @click="save">Salvar</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<style>
.transaction-form {
  font-weight: 600;
  text-align: center;
  max-width: 450px;
}

.full-width {
  width: 100%;
}
</style>