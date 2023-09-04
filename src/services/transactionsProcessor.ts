import { watch, type Ref } from "vue";

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

      let xAxisData = [];
      let positiveData: any[] = [];
      let negativeData: any[] = [];

      if (diffDays <= 31) {
        // Group by days
        for (let i = 0; i < diffDays; i++) {
          const date = new Date(startDate.getTime() + i * oneDay);
          xAxisData.push(date.toISOString().slice(0, 10));
          positiveData.push(0);
          negativeData.push(0);
        }

        mergeData.value.forEach((item: any) => {
          const dayIndex = Math.floor(
            (item.time.getTime() - startDate.getTime()) / oneDay
          );
          if (dayIndex >= 0 && dayIndex < diffDays) {
            const amount = item.amount;
            if (item.typeValue === "plus") {
              positiveData[dayIndex] += amount;
            } else if (item.typeValue === "minus") {
              negativeData[dayIndex] += amount;
            }
          }
        });
      } else {
        // Group by months dynamically based on the data
        let currentMonth = startDate.getMonth();
        let currentYear = startDate.getFullYear();
        let endYear = endDate.getFullYear();
        let endMonth = endDate.getMonth();

        while (
          currentYear < endYear ||
          (currentYear === endYear && currentMonth <= endMonth)
        ) {
          xAxisData.push(
            new Date(currentYear, currentMonth, 1).toLocaleString("en-us", {
              month: "short",
            })
          );
          positiveData.push(0);
          negativeData.push(0);

          currentMonth++;
          if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
          }
        }

        mergeData.value.forEach((item) => {
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
        });
      }

      positiveData.forEach((item, index) => {
        positiveData[index] = parseFloat(item.toFixed(2));
        totalGain.value += parseFloat(item);
      });
      negativeData.forEach((item, index) => {
        negativeData[index] = parseFloat(item.toFixed(2));
        totalCost.value += parseFloat(item);
      });

      options.value = {
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
  );
};
