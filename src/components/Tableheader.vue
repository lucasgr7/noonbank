<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps(['title']);
const emits = defineEmits(['search']);

const search = ref();

function handleSearch(){
  emits('search', search.value);
}

</script>

<template>
  <el-row align="middle">
    <el-col :span="4">
      <h3>{{props.title}}</h3>
    </el-col>
    <el-col :span="18">
      <el-input type="text"
      @change="handleSearch"
      v-model="search"
      placeholder="Search" 
      clearable></el-input>
    </el-col>
  </el-row>
</template>