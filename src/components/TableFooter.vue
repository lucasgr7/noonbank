<script lang="ts" setup>

const emits = defineEmits(['size-change', 'current-change']);
const props = defineProps({
  currentPage: Number,
  pageSize: Number,
  total: Number
});

function handleSizeChange(val: number) {
  emits('size-change', val);
};
function handleCurrentChange(val: number) {
  emits('current-change', val);
};

</script>
<template>
<el-pagination 
  @size-change="handleSizeChange" 
  @current-change="handleCurrentChange" 
  class="paginator" 
  :current-page="props.currentPage"
    :page-sizes="[10, 20, 50, 100]" :page-size="props.pageSize"
    :total="(props.total) ?? 0">
  </el-pagination>
</template>