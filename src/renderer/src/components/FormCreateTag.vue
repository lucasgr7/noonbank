<script lang="ts" setup>
import { ElColorPicker, ElDialog, ElNotification } from 'element-plus';
import { computed, reactive, ref, watch } from 'vue';
import { useCategories } from '../composables/useCategories';

const { insertCategory, error } = useCategories();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['close']);

const isVisible = ref(false);
watch(
  () => props.visible,
  (value) => {
    isVisible.value = value;
  },
);

const form = reactive({
  name: '',
  colorFont: '',
  backgroundColor: '',
})

// create a computed that reutrns css object with the form
const computedCss = computed(() => {
  return {
    color: form.colorFont,
    backgroundColor: form.backgroundColor,
    border: `1px solid ${form.colorFont}`,
    fontSize: '14px'
  }
})

function save() {
  insertCategory(form);
  if(error.value){
    ElNotification({
      title: 'Erro',
      message: error.value,
      type: 'error',
    });
  }else{
    ElNotification({
      title: 'Sucesso',
      message: 'Categoria criada com sucesso',
      type: 'success',
    });
    emits('close');
  }
}

</script>
<template>
  <el-dialog :draggable="true" id="formCreateTag" v-model="isVisible" @close="emits('close')">
    <template #header>
      <h3>Nova Categoria</h3>
    </template>
    <el-row>
      <el-col :span="4">
        <label>
          Nome
        </label>
      </el-col>
      <el-col :span="20">
        <el-input type="text" v-model="form.name" placeholder="Nome da Categoria" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <label>
          Cor do texto
        </label>
      </el-col>
      <el-col :span="20">
        <el-color-picker v-model="form.colorFont"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <label>
          Cor de fundo
        </label>
      </el-col>
      <el-col :span="20">
        <el-color-picker v-model="form.backgroundColor"/>
      </el-col>
    </el-row>
    <el-row justify="center" >
      <el-tag :style="computedCss" class="tag">
        {{ form.name }}
      </el-tag>
    </el-row>
    <template #footer>
      <el-row justify="end">
        <el-button @click="save" type="default">Salvar</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>
<style lang="scss">
#formCreateTag{
  /* From https://css.glass */
  background: rgba(41, 240, 174, 0.5);
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