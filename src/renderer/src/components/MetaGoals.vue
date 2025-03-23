<script lang="ts" setup>
import { computed, unref } from 'vue';
import { usePeriod } from '@renderer/composables/period';
import { useCategories } from '@renderer/composables/useCategories';
import { TypeMergeData, useMergeTransaction } from '@renderer/composables/useMergeTransaction';
import GoalCard from './GoalCard.vue';

const { pastYearRange } = usePeriod();
const { mergeData } = useMergeTransaction(pastYearRange);
const { categoryLookupTable } = useCategories();

// Computed property that groups data by category and year-month,
// then computes the maximum monthly spending, the minimum monthly spending,
// and the spending for the current month.
const mergeDataByCategory = computed(() => {
  const grouping: Record<string, Record<string, number>> = {};

  mergeData.value.forEach((item: TypeMergeData) => {
    if (item.typeValue !== 'minus') return;

    const amount = typeof item.amount === 'number' ? item.amount : parseFloat(item.amount as string);
    const categoryKey = item.categoryId ? item.categoryId.toString() : item.category;
    const date = new Date(item.time);
    const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    if (!grouping[categoryKey]) {
      grouping[categoryKey] = {};
    }
    if (!grouping[categoryKey][yearMonth]) {
      grouping[categoryKey][yearMonth] = 0;
    }
    grouping[categoryKey][yearMonth] += amount;
  });

  const currentDate = pastYearRange.value.endDate;
  console.log('currentDate: ', currentDate);
  // if current Date is first day of the month, convert to last day of the month
  if (currentDate.getDate() === 1) {
    currentDate.setMonth(currentDate.getMonth() - 1);
    currentDate.setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate());
  }
  const currentYearMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}`;

  const result: Record<string, { maxSpent: number; minSpent: number; currentSpent: number }> = {};
  const lookupCategory = unref(categoryLookupTable) ?? {};

  for (const categoryKey in grouping) {
    const monthEntries = Object.entries(grouping[categoryKey]);
    const allSums = monthEntries.map(([_, sum]) => sum);
    const maxSpent = Math.max(...allSums);
    const currentSpent = grouping[categoryKey][currentYearMonth] || 0;

    // Filtra os meses que não são o mês atual.
    const filteredSums = monthEntries
      .filter(([month, _]) => month !== currentYearMonth)
      .map(([_, sum]) => sum);

    // Sempre desconsideramos o mês atual para o cálculo do mínimo.
    // Se não houver meses históricos, definimos o mínimo como 0.
    let minSpent: number;
    if (filteredSums.length > 0) {
      minSpent = Math.min(...filteredSums);
    } else {
      minSpent = 0;
    }

    // Utiliza a lookup table para obter o nome da categoria.
    const categoryName = lookupCategory[categoryKey]?.name || categoryKey;
    result[categoryName] = { maxSpent, minSpent, currentSpent };
  }
  console.log('data meta goals: ', result);
  return result;
});


// Filter out categories with a currentSpent of 0.
const mergeDataByCategoryFiltered = computed(() => {
  const result: Record<string, { maxSpent: number; minSpent: number; currentSpent: number }> = {};
  for (const key in mergeDataByCategory.value) {
    if (mergeDataByCategory.value[key].currentSpent !== 0) {
      result[key] = mergeDataByCategory.value[key];
    }
  }
  return result;
});
</script>

<template>
  <div>
    <h3 style="font-size: 16px; margin-bottom: 16px;">Orçamento</h3>
    <el-row :gutter="20">
      <!-- Each card occupies 1/3 of the row -->
      <el-col
        v-for="(data, category) in mergeDataByCategoryFiltered"
        :key="category"
        :span="8"
        style="margin-bottom: 20px;"
      >
        <GoalCard :data="data" :category="category" />
      </el-col>
    </el-row>
  </div>
</template>