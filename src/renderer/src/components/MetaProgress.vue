<script lang="ts" setup>
import { computed, ref } from 'vue';
import { usePeriod } from '@renderer/composables/period';
import { useMergeTransaction, TypeMergeData } from '@renderer/composables/useMergeTransaction';
import { useCategories } from '@renderer/composables/useCategories';
import { formatBrazilianReal } from '@renderer/util/format';

const { pastYearRange } = usePeriod();
const { mergeData } = useMergeTransaction(pastYearRange);
const { categoryLookupTable } = useCategories();

// Agrupa os dados por categoria e ano-mês, calculando maxSpent, minSpent (desconsiderando o mês atual) e currentSpent.
const mergeDataByCategory = computed(() => {
  const grouping: Record<string, Record<string, number>> = {};

  mergeData.value.forEach((item: TypeMergeData) => {
    if (item.typeValue !== 'minus') return;
    const amount = typeof item.amount === 'number' ? item.amount : parseFloat(item.amount as string);
    // Usa categoryId se disponível; senão, usa o nome da categoria
    const categoryKey = item.categoryId ? item.categoryId.toString() : item.category;
    const date = new Date(item.time);
    const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    if (!grouping[categoryKey]) grouping[categoryKey] = {};
    grouping[categoryKey][yearMonth] = (grouping[categoryKey][yearMonth] || 0) + amount;
  });

  // Define a data atual como a data final do período
  const currentDate = pastYearRange.value.endDate;
  // Se for o primeiro dia do mês, ajusta para o último dia do mês anterior
  if (currentDate.getDate() === 1) {
    currentDate.setMonth(currentDate.getMonth() - 1);
    currentDate.setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate());
  }
  const currentYearMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}`;

  const result: Record<string, { maxSpent: number; minSpent: number; currentSpent: number }> = {};
  const lookupCategory = categoryLookupTable.value || {};

  for (const categoryKey in grouping) {
    const monthEntries = Object.entries(grouping[categoryKey]);
    const allSums = monthEntries.map(([_, sum]) => sum);
    const maxSpent = Math.max(...allSums);
    const currentSpent = grouping[categoryKey][currentYearMonth] || 0;
    // Calcula o mínimo descartando o mês atual
    const filteredSums = monthEntries
      .filter(([month]) => month !== currentYearMonth)
      .map(([_, sum]) => sum);
    const minSpent = filteredSums.length > 0 ? Math.min(...filteredSums) : 0;
    // Recupera o nome da categoria usando a lookup table
    const categoryName = lookupCategory[categoryKey]?.name || categoryKey;
    result[categoryName] = { maxSpent, minSpent, currentSpent };
  }
  return result;
});

// Filtra categorias com currentSpent diferente de 0 
const filteredMergeData = computed(() => {
  const result: Record<string, { maxSpent: number; minSpent: number; currentSpent: number }> = {};
  for (const key in mergeDataByCategory.value) {
    result[key] = mergeDataByCategory.value[key];
  }
  return result;
});

// Cálculos totais para o progresso de gastos
const totalMinSpent = computed(() =>
  Object.values(filteredMergeData.value).reduce((acc, cur) => acc + cur.minSpent, 0)
);
const totalMaxSpent = ref(20000);
const totalCurrentSpent = computed(() =>
  Object.values(filteredMergeData.value).reduce((acc, cur) => acc + cur.currentSpent, 0)
);
const totalSpendingProgress = computed(() => {
  if (totalMaxSpent.value === totalMinSpent.value) return 100;
  let percentage =
    ((totalCurrentSpent.value) / (totalMaxSpent.value)) * 100;
  if (percentage < 0) percentage = 0;
  return Math.round(percentage);
});

// Progresso do mês em dias
const today = new Date();
const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
const currentDay = today.getDate();
const monthProgress = computed(() => Math.round((currentDay / totalDays) * 100));
</script>

<template>
  <el-row :gutter="20" style="margin-bottom: 8px;">
    <el-col :span="12">
      <el-card>
        <h3>Progresso do Mês</h3>
        <el-progress :percentage="monthProgress" class="progress-bar" style="height: 8px;" />
        <div class="progress-info">{{ currentDay }} de {{ totalDays }} dias</div>
    </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
          <h3>Percentual Orçamento gasto</h3>
          <el-progress :percentage="totalSpendingProgress" class="progress-bar" style="height: 8px;" />
          <el-row justify="center" class="progress-info">
            <span class="f-blue">{{ formatBrazilianReal(totalMinSpent) }} - </span>
            <b>{{ formatBrazilianReal(totalCurrentSpent) }} </b> -
            <span class="f-red">{{ formatBrazilianReal(totalMaxSpent) }}</span>
          </el-row>
      </el-card>
    </el-col>
  </el-row>
    <!-- Barra de progresso do mês -->

  <!-- Barra de progresso total de gastos -->
</template>



<style scoped lang="scss">
.el-card{
  margin: 0;
  padding: 0px;
}
.el-card__body{
  padding: 0px !important;
}
.meta-progress-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

.meta-progress-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #2e7d32;
  /* verde */
}

.progress-bar {
  width: 100%;
}

.progress-info {
  font-size: 18px;
  text-align: right;
  color: #2e7d32;
}
</style>