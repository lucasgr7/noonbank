import {  computed, ref } from "vue";
const selectedMonth = ref(new Date());
const dates = ref(['', '']);


export const usePeriod = () => {

  function changeDate(month: Date) {
    selectedMonth.value = month;
  }
  const dates = computed(() => {
    const month = selectedMonth.value;
    const firstDay = (new Date(month.getFullYear(), month.getMonth(), 1)).toJSON();
    const lastDay = (new Date(month.getFullYear(), month.getMonth() + 1, 0)).toJSON();
    return [firstDay, lastDay];
  })
  changeDate(selectedMonth.value);

  return {
    selectedMonth, dates, changeDate
  }
}