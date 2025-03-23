import { computed, ref } from "vue";
const selectedMonth = ref(new Date());


interface DateRange {
  startDate: Date;
  endDate: Date;
}
export const usePeriod = () => {

  function changeDate(month: Date) {
    selectedMonth.value = month;
  }
  const dates = computed((): DateRange => {
    const month = selectedMonth.value;
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return { startDate, endDate } ;
  })
  const previousMonthDates = computed((): DateRange => {
    const month = selectedMonth.value;
    const startDate = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    const endDate = new Date(month.getFullYear(), month.getMonth(), 0);
    return { startDate, endDate } ;
  });
  changeDate(selectedMonth.value);

  const pastYearRange = computed((): DateRange => {
      const today = selectedMonth.value;
      const pastYearStartDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      return { startDate: pastYearStartDate, endDate: today };
    }
  )

  return {
    selectedMonth, dates, changeDate, previousMonthDates, pastYearRange
  }
}