<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import SelectCategory from './SelectCategory.vue';
import { useCategories } from '../composables/useCategories';
import _ from 'lodash';
import { TypeMergeData } from '@renderer/composables/useMergeTransaction';

const { categories, getCategories } = useCategories();
const visible = ref(false);

const emits = defineEmits(['closeDialog', 'save', 'changeCategory']);
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Transação',
  },
  form: {
    type: Object,
    default: {},
    required: true,
  },
  isCreditTransaction: {
    type: Boolean,
    default: false,
  },
})

onMounted(() => {
  getCategories();
})

watch(
  () => props.isVisible,
  (value) => {
    visible.value = value;
  },
);

const typeValue = computed(() => {
  return props.form.typeValue === 'plus' ? 'Entrada' : 'Saída';
});

function formatDescription(description: string) {
  if (description.toLowerCase().includes('transferência enviada') || description.toLowerCase().includes('transferência recebida')) {
    return description.replace('Transferência enviada -', '').replace('Transferência recebida -', '').trim();
  }
  return description;
}

const description = computed({
  get: () => formatDescription(props.form.description),
  set: (newDescription) => { props.form.description = newDescription; }
});

// actions
function changeCategory(categoryId: number) {
  emits('changeCategory', categoryId);
}

function save(form: TypeMergeData) {
  emits('save', form);
}

function cancel() {
  emits('closeDialog');
}

</script>

<template>
  <el-dialog :draggable="true" :id="props.id" v-model="visible" :title="props.title"
    class="transaction-form" @close="emits('closeDialog')">
    <el-form>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-row>
            Data
          </el-row>
          <el-row>
            <el-form-item class="full-width">
              <el-date-picker v-model="form.time" type="date" placeholder="Selecione a data" 
              format="DD/MM/YYYY" disabled style="width: 100%;">
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
              <el-select v-model="typeValue" class="full-width" placeholder="Selecione" disabled>
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
          <SelectCategory :categories="categories" v-model="form.categoryId"
          @change="changeCategory" class="full-width" />
        </el-form-item>
      </el-row>
      <el-row>
        Descrição
      </el-row>
      <el-row>
        <el-form-item class="full-width">
          <el-input v-model="description" placeholder="Descrição"></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-row>
            Preço
          </el-row>
          <el-row>
            <el-form-item class="full-width">
              <el-input type="number" v-model="form.amount" placeholder="R$" :disabled="isCreditTransaction"></el-input>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-row :gutter="6">
        <el-col :span="12" @click="cancel">
          <el-button class="full-width">Cancelar</el-button>
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