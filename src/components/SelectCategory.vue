<script lang="ts" setup>
import { ref } from 'vue';
import { Category } from '../composables/useCategories';
import _ from 'lodash';

const item = ref();

const emits = defineEmits(['change']);
const props = defineProps({
  categories: {
    type: Array<Category>,
    default: [],
    required: true
  },
})

function computedCss(form: any) {
  return {
    color: form.color_font,
    backgroundColor: form.background_color,
    border: `1px solid ${form.color_font}`,
    fontSize: '14px'
  }
}

function handleCategoryChange(form: unknown) {
  emits('change', form);
}

</script>
<template>
<el-select placeholder="Select Category"
    v-model="item" @change="handleCategoryChange(item)">
    <el-option v-for="category in props.categories" :key="category.id" :label="category.name" :value="category.id">
      <el-tag :style="computedCss(category)" class="tag">
        {{ category.name }}
      </el-tag>
    </el-option>
  </el-select>
</template>