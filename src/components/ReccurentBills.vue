<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useRecurrentBills } from '../composables/useRecurrentBills';
import { usePeriod } from '../composables/period';
import { useMergeTransaction } from '../composables/useMergeTransaction';


const {records, getRecords} = useRecurrentBills();
const { dates } = usePeriod();
const { mergeData } = useMergeTransaction(dates);

const recurrentBills = computed(() => {
  if(!records.value) return [];

  const result = [] as {label: string, value: number, paid: boolean}[];

  for(let i = 0; i < records.value.length; i++){
    const record = records.value[i];
    // filter all the recrods that match like %% with the record.key

    // if record.key contains a comma split and try find any of the options
    const keys = record.key.split(',');
    const merge = mergeData.value.find((item) => {
      for(let i = 0; i < keys.length; i++){
        if(item.description.includes(keys[i])) return true;
      }
      return false;
    });
    if(merge){
      result.push({
        label: record.label,
        value: Number(merge.amount),
        paid: true
      })
    }
    else{
      result.push({
        label: record.label,
        value: 0,
        paid: false
      })
    }
  }
  return result.sort((a, b) => a.label.localeCompare(b.label));
})
const total = computed(() => {
  if(!recurrentBills.value) return 0;
  return recurrentBills.value.length;
})
const totalPaid = computed(() => {
  if(!recurrentBills.value) return 0;
  return recurrentBills.value.filter((item) => item.paid).length;
})
const totalAmount = computed(() => {
  if(!recurrentBills.value) return 0;
  return recurrentBills.value.reduce((acc, item) => acc + item.value, 0);
})

onMounted(() => {
  getRecords();
})
</script>
<template>
  <el-card id="recurrent-debts">
    <el-row justify="center">
      <h1> <span class="color-dark">{{totalPaid}}</span>/<span class="color-light">{{total}}</span></h1>
    </el-row>
    <div class="total-amount">
      R$ {{  totalAmount.toLocaleString('pt-br', {minimumFractionDigits: 2}) }}
    </div>
    <ul>
      <li v-for="(item) of recurrentBills">
        <div class="circle" :class="{'dark' : item.paid, 'light': !item.paid}"></div>
        <span> {{ item.label }} - <b>R$ {{ item.value.toLocaleString('pt-br', { minimumFractionDigits: 2}) }}</b></span>
      </li>
    </ul>
  </el-card>
</template>
<style lang="scss" scoped>
#recurrent-debts{
  background: white;
  height: 100%;
  max-height: 57.4vh;
  overflow-y: auto;

  h1{    
    font-size: 55px;
    padding: 0;
    margin: 7px;
    color: #3f9614;
    font-weight: revert;
    margin: 0;
  }
  ul{
    list-style: none;
    padding: 0;
    margin: 0;
    li{
      display: flex;
      align-items: center;
      margin: 10px 0;
      color: gray;
      .circle{
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .light{
    background: #dab68e;
  }
  .color-light{
    color: #dab68e;
  }
  .dark{
    background: #2a670c;
  }
  .color-dark{
    color: #2a670c;
  }
  .total-amount{
    // border top 2 px black
    border-top: 2px solid black;
    // align middle
    display: flex;
    align-items: center;
    justify-content: center;

  }
}
</style>