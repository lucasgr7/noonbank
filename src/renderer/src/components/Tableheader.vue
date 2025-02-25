z <script lang="ts" setup>
import _ from 'lodash';
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Title'
  }
});
const emits = defineEmits(['search']);

const search = ref();
const selectedMonth = ref(new Date());
const isIncludedMonth = ref(true);

function emitSearch(){
  if(isIncludedMonth.value)
    emits('search', search.value, selectedMonth.value);
  else
    emits('search', search.value, null);
  return;
}

function handleSearch(){
  emitSearch();
}

</script>

<template>
  <el-row align="middle" justify="start" :gutter="20" >
    <el-col :span="2">
      <h3>{{props.title}}</h3>
    </el-col>
    <el-col :span="8" >
      <el-input type="text"
      @change="handleSearch"
      v-model="search"
      placeholder="Search" 
      clearable></el-input>
    </el-col>
    <el-col :span="4" >
      <el-date-picker
        v-model="selectedMonth"
        type="month"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
        @change="handleSearch"
        style="width: 100%" />
    </el-col>
    <el-col :span="2">
      <el-checkbox v-model="isIncludedMonth">Incluir Mês</el-checkbox>
    </el-col>
  </el-row>
</template>