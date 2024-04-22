<script lang="ts" setup>
import { ref, watch } from 'vue';

const emits = defineEmits(['close']);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
})

const isVisible = ref(false);

watch(
  () => props.visible,
  (value) => {
    isVisible.value = value;
  },
);

</script>

<template>
  <el-dialog @close="emits('close')" v-model="isVisible" title="Editar Conta Recorrente" class="form">
    <el-row>
      Nome
    </el-row>
    <el-row>
      <el-form-item class="full-width" >
        <el-input v-model="data.label" placeholder="Nome"></el-input>
      </el-form-item>
    </el-row>
    <el-row>
      Tags
    </el-row>
    <el-row>
      <el-form-item class="full-width">
        <el-input v-model="data.tags" placeholder="Tags"></el-input>
      </el-form-item>
    </el-row>
  </el-dialog>
</template>

<style>
.form {
  font-weight: 600;
  text-align: center;
  max-width: 450px;
}
</style>
