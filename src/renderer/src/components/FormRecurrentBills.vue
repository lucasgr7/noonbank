<script lang="ts" setup>
import { recurrent_bills } from '@renderer/composables/useRecurrentBills';
import { ref, watch } from 'vue';

const emits = defineEmits(['close', 'saveData', 'deleteData']);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Conta Reccorente'
  },
  isEditDialog: {
    type: Boolean,
    default: false,
  },
  form: {
    type: Object,
    default: () => ({}),
  },
});

const isVisible = ref(false);
const labelError = ref('');
const keyError = ref('');

function validateForm() {
  let isValid = true;
  if (!props.form.label) {
    labelError.value = 'Campo obrigatório';
    isValid = false;
  } else if (!props.form.key) {
    keyError.value = 'Campo obrigatório';
    isValid = false;
  }
  return isValid;
}

function saveData(form: recurrent_bills) {
  emits('saveData', form);
}

function deleteData() {
  emits('deleteData');
}

function cleanData() {
  props.form.label = '';
  props.form.key = '';
  labelError.value = '';
  keyError.value = '';
}

watch(
  () => props.visible,
  (value) => {
    isVisible.value = value;
  },
);

</script>

<template>
  <el-dialog @close="emits('close')" v-model="isVisible" :title="props.title" class="form">
    <el-form>
      <el-row>
        Nome
      </el-row>
      <el-row>
        <el-form-item class="full-width" :error="labelError">
          <el-input v-model="form.label" placeholder="Nome" type="text" 
            @blur="() => validateForm()" @input="() => labelError = ''">
          </el-input>
        </el-form-item>
      </el-row>
      <el-row>
        Tags
      </el-row>
      <el-row>
        <el-form-item class="full-width" :error="keyError">
          <el-input v-model="form.key" placeholder="Tags" type="text" 
            @blur="() => validateForm()" @input="() => keyError = ''">
          </el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <el-row :gutter="6" justify="end">
        <el-col :span="12" v-if="isEditDialog">
          <el-button class="full-width" type="danger" @click="deleteData">Deletar</el-button>
        </el-col>
        <el-col :span="12" v-if="!isEditDialog">
          <el-button class="full-width" @click="cleanData">Limpar</el-button>
        </el-col>
        <el-col :span="12">
          <el-button class="full-width" type="primary" :disabled="!form.label || !form.key"
          @click="saveData">{{ isEditDialog ? 'Salvar' : 'Criar' }}
          </el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<style>
.form {
  font-weight: 600;
  text-align: center;
  max-width: 450px;
}
</style>
