<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { Stock, useStock } from '../composables/useStock';
import { ElNotification } from 'element-plus';

const { insertRecord, error } = useStock();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['close']);

const isVisible = ref(false);
watch(() => props.visible, (value) => {
    isVisible.value = value;
  },
);
watch(() => error.value, (value) => {
  if (value) {
    ElNotification({
      title: 'Erro',
      message: value,
      type: 'error',
    })
  }
})


const form = reactive({
  symbol: '',
  quantity: 0,
  investment_type: 'brazilian_stock',
} as Stock)

function handleSave(){
  insertRecord(form);
  emits('close');
}


</script>
<template>
  <el-dialog :draggable="true" id="formCreateStock" v-model="isVisible" @close="emits('close')">
    <template #header>
      <h3>Nova Ação</h3>
    </template>
    <el-row>
      <el-col>
        <label>
          Símbolo
        </label>
      </el-col>
      <el-col>
        <el-input type="text" v-model="form.symbol" placeholder="Símbolo"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <label>
          Quantidade
        </label>
      </el-col>
      <el-col>
        <el-input type="number" v-model="form.quantity" placeholder="Quantidade"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <label>
          Tipo
        </label>
      </el-col>
      <el-col>
        <el-select v-model="form.investment_type" placeholder="Tipo">
          <el-option label="Ação Brasileira" value="brazilian_stock"></el-option>
          <el-option label="Ação Americana" value="us_stock"></el-option>
          <el-option label="Tesouro Direto" value="brazilian_treasury_bond" ></el-option>
          <el-option label="Liquído" value="liquid_investment"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <template #footer>
      <el-button type="primary" @click="handleSave">Salvar</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss">
#formCreateStock{
  /* From https://css.glass */
  background: rgba(19, 108, 172, 0.5);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.1px);
  -webkit-backdrop-filter: blur(8.1px);
  border: 1px solid rgba(255, 255, 255, 0.62);
  h3, label{
    color: white;
    font-size: 18px;
  }
  .el-row{
    margin-top: 8px;
  }
}
</style>