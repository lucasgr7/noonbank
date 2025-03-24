<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { useCategories } from '@renderer/composables/useCategories';
import { formatBrazilianReal } from '@renderer/util/format';

const props = defineProps<{
  category: string;
  data: { minSpent: number; maxSpent: number; currentSpent: number }
}>();

// Recupera a tabela de categorias e a cor primária para cada categoria
const { categoryLookupTable } = useCategories();

// Acessa a cor primária usando a chave da categoria (convertida para uppercase)
const primaryColor = computed(() => {
  const key = props.category.toUpperCase();
  return (categoryLookupTable.value ?? {})[key]?.primaryColor || '#dcdcdc';
});

// Calcula a porcentagem de progresso entre minSpent e maxSpent (de 0 a 100)
const computePercentage = (min: number, max: number, current: number): number => {
  if (max === min) return 100;
  let percentage = ((current - min) / (max - min)) * 100;
  if (percentage < 0) percentage = 0;
  return Math.round(percentage);
};

// Verifica se o valor atual está abaixo da meta (menor que o minSpent)
const isBelowGoal = computed(() => props.data.currentSpent < props.data.minSpent);

// Calcula a porcentagem que falta para atingir o mínimo (meta)
const missingValue = computed(() => {
  return Math.max(0, props.data.minSpent - props.data.currentSpent);
});

// Estilo do cartão: mantém padding e fonte; se estiver abaixo da meta, aplica borda e fundo motivadores
const cardStyle = computed(() => {
  const baseStyle = {
    padding: '10px',
    fontSize: '14px'
  };
  if (isBelowGoal.value) {
    return {
      ...baseStyle,
      border: '1px solid green',
      backgroundColor: '#e0f9e0'
    };
  } else {
    return {
      ...baseStyle,
      border: `1px solid ${primaryColor.value}`
    };
  }
});

// New dynamic progress bar color function
const progressBarColor = (percentage: number): string => {
  if (percentage <= 100) {
    const r = 0;
    const g = Math.round((percentage / 100) * 255);
    const b = Math.round(((100 - percentage) / 100) * 255);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const extra = Math.min(percentage - 100, 100);
    const r = 255;
    const g = Math.round(255 * ((100 - extra) / 100));
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  }
};
</script>

<template>
  <el-card :shadow="'hover'" :style="cardStyle">
    <div style="margin-bottom: 8px; font-weight: bold; text-align: center;">
      {{ category.toUpperCase() }} - 
      <span class="current-spent" style="font-size: 20px;">
        {{ formatBrazilianReal(data.currentSpent) }}
      </span>
    </div>
    <el-row :gutter="10" align="middle">
      <template v-if="isBelowGoal">
        <!-- Exibe duas colunas quando abaixo da meta -->
        <el-col :span="14">
          <el-progress
            :percentage="computePercentage(0, data.minSpent, data.currentSpent)"
            style="height: 8px;"
            :color="progressBarColor(computePercentage(0, data.minSpent, data.currentSpent))"
          />
          <el-row justify="center">
            <div style="font-size: 14px; color: green; padding-top: 8px">
              Abaixo da meta em <b>{{ formatBrazilianReal(missingValue) }}</b>
            </div>
          </el-row>
        </el-col>
        <el-col :span="10" style="text-align: center;">
          <div>Limite: {{ formatBrazilianReal(data.minSpent) }}</div>
        </el-col>
      </template>
      <template v-else>
        <!-- Exibe a versão padrão: Min, progress bar e Max -->
        <el-col :span="6" style="text-align: center;">
          <div>Min: {{ formatBrazilianReal(data.minSpent) }}</div>
        </el-col>
        <el-col :span="12">
          <el-progress
            :percentage="computePercentage(data.minSpent, data.maxSpent, data.currentSpent)"
            style="height: 8px;"
            :color="progressBarColor(computePercentage(data.minSpent, data.maxSpent, data.currentSpent))"
          />
        </el-col>
        <el-col :span="6" style="text-align: center;">
          <div>Max: {{ formatBrazilianReal(data.maxSpent) }}</div>
        </el-col>
      </template>
    </el-row>
  </el-card>
</template>
