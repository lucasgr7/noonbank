import {  computed, ref } from "vue";
const selectedMonth = ref(new Date());


export const usePeriod = () => {

  function changeDate(month: Date) {
    selectedMonth.value = month;
  }
  const dates = computed(() => {
    const month = selectedMonth.value;
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return {startDate, endDate};
  })
  changeDate(selectedMonth.value);

  return {
    selectedMonth, dates, changeDate
  }
}