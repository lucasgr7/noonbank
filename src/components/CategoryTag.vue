<script lang="ts" setup>
import { computed } from 'vue';
import { Category } from '../composables/useCategories';


const props = defineProps({
  id: {
    type: Number,
    default: 0
  },
  categories: {
    type: Array,
    default: []
  }
});

const category = computed(() => {
  // filter categories by id, and return a prop css and the name
  const cad = props.categories.filter((category: Category) => category.id === props.id)[0] as Category;
  return {
    css: {
      backgroundColor: cad.background_color,
      color: cad.color_font,
      border: `1px solid ${cad.color_font}`
    },
    text: cad.name
  }
})

</script>
<template>
  <el-tag :style="category.css"  class="tag"> {{ category.text }}</el-tag>
</template>