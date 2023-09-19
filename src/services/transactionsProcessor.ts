import { TypeMergeData } from './../composables/useMergeTransaction';
import { watch, type Ref } from "vue";
import { TypeMergeData } from "../composables/useMergeTransaction";

const ONE_DAY = 24 * 60 * 60 * 1000;


function generateOptions(
  xAxisData: string[] = [],
  positiveData: any[] = [],
  negativeData: any[] = [],
  ){
    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        data: ["Ganhos", "Gastos"],
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: xAxisData,
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Ganhos",
          type: "line",
          areaStyle: {},
          color: "green",
          emphasis: {
            focus: "series",
          },
          data: positiveData,
        },
        {
          name: "Gastos",
          type: "line",
          color: "red",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: negativeData,
        },
      ],
    };
  }

const processDailyData = (diffDays: any, startDate: any, mergeData: any, positiveData: any, negativeData: any, xAxisData: any) => {
  for (let i = 0; i < diffDays; i++) {
    const date = new Date(startDate.getTime() + i * ONE_DAY);
    xAxisData.push(date.toISOString().slice(0, 10));
    positiveData.push(0);
    negativeData.push(0);
  }

  mergeData.value.forEach((item: TypeMergeData) => {
    const dayIndex = Math.floor((item.time.getTime() - startDate.getTime()) / ONE_DAY);
    if (dayIndex >= 0 && dayIndex < diffDays) {
      const amount = item.amount;
      if (item.typeValue === "plus") positiveData[dayIndex] += amount;
      if (item.typeValue === "minus") negativeData[dayIndex] += amount;
    }
  });
};
const processMonthlyData = (startDate: any, endDate: any, mergeData: any, positiveData: any, negativeData: any, xAxisData: any) => {
  let currentMonth = startDate.getMonth();
  let currentYear = startDate.getFullYear();
  let endYear = endDate.getFullYear();
  let endMonth = endDate.getMonth();

  while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
    xAxisData.push(new Date(currentYear, currentMonth, 1).toLocaleString("en-us", { month: "short" }));
    positiveData.push(0);
    negativeData.push(0);

    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  // Missing logic to populate positiveData and negativeData based on mergeData
  mergeData.value.forEach((item: any) => {
    const monthIndex = (item.time.getFullYear() - startDate.getFullYear()) * 12 + (item.time.getMonth() - startDate.getMonth());
    const amount = item.amount;
    if (monthIndex >= 0 && monthIndex < xAxisData.length) {
      if (item.typeValue === "plus") {positiveData[monthIndex] += amount};
      if (item.typeValue === "minus") {negativeData[monthIndex] += amount};
    }
  });
};


const mapMergeData = (item: TypeMergeData, startDate: Date, xAxisData: any, positiveData: any, negativeData:any) => {
  const monthIndex =
    (item.time.getFullYear() - startDate.getFullYear()) * 12 +
    (item.time.getMonth() - startDate.getMonth());
  const amount = item.amount; // Convert the amount to a number
  if (monthIndex >= 0 && monthIndex < xAxisData.length) {
    if (item.typeValue === "plus") {
      positiveData[monthIndex] += amount;
    } else if (item.typeValue === "minus") {
      negativeData[monthIndex] += amount;
    }
  }
}


export const processor = (
  totalGain: Ref<number>,
  totalCost: Ref<number>,
  dateRange: Ref,
  mergeData: Ref,
  options: Ref
) => {
  watch(
    () => mergeData.value,
    () => {
      if (mergeData.value?.length === 0) return;

        // reset variables
        totalGain.value = 0;
        totalCost.value = 0;

        const {startDate, endDate} = dateRange.value;
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay)) + 1;

        let xAxisData: string[] = [];
        let positiveData: any[] = [];
        let negativeData: any[] = [];

        if (diffDays <= 31) {
          processDailyData(diffDays, startDate, mergeData, positiveData, negativeData, xAxisData);
        } else {
          processMonthlyData(startDate, endDate, mergeData, positiveData, negativeData, xAxisData);
        }

        // mergeData.value.forEach((item: TypeMergeData) => mapMergeData(item, startDate, xAxisData, positiveData, negativeData));
        positiveData.forEach((item: any, index: number) => {
          positiveData[index] = parseFloat(item.toFixed(2));
          totalGain.value += parseFloat(item);
        });
        negativeData.forEach((item: any, index: number) => {
          negativeData[index] = parseFloat(item.toFixed(2));
          totalCost.value += parseFloat(item);
        });
  
        options.value = generateOptions(xAxisData, positiveData, negativeData);
      }      
  );
};
