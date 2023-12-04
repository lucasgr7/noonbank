import { Ref, ref } from "vue";
import { TypeMergeData } from "./useMergeTransaction";
import { Category } from "./useCategories";


export default function useMedianCategoryCosts(mergeData: Ref<TypeMergeData[]>, propCategories: Ref<Category[]>) {

  const option = ref();

  function render() {
    let dataByMonth: any = {};
    let categories = new Set();
    if (mergeData.value == null) {
      console.error("mergeData is null");
      return;
    }
    if(propCategories.value == null){
      console.log('propCategories is null');
      return;
    }

    // Step 1: Aggregate data by month and category
    mergeData.value.forEach((transaction: TypeMergeData) => {
      const date = new Date(transaction.time);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const labelCategory = propCategories.value.find(
        (category) => category.id === transaction.categoryId
      )?.name?.toUpperCase();

      if (labelCategory == null) return;

      if (!dataByMonth[month]) dataByMonth[month] = {};
      if (!dataByMonth[month][labelCategory ?? "none"])
        dataByMonth[month][labelCategory ?? "none"] = 0;
      dataByMonth[month][labelCategory ?? "none"] += transaction.amount;
      categories.add(labelCategory ?? "none");
    });

    // Step 2: Prepare chart series data
    let seriesData = Array.from(categories).map((category) => ({
      name: category,
      type: "bar",
      data: [],
    }));

    let trendLine = {
      name: "Trend",
      type: "line",
      data: [],
    };

    let xAxisData: any = [];

    // Limit to last 5 months
    let lastMonths = Object.keys(dataByMonth).sort();
    lastMonths.forEach((month) => {
      xAxisData.push(month);

      seriesData.forEach((series) => {
        series.data.push(dataByMonth[month][series.name] || 0);
      });
    });

    // Step 3: Trend line calculation (simplified)
    seriesData.forEach((series) => {
      let total = series.data.reduce((acc, val) => acc + val, 0);
      let avg = total / series.data.length;
      trendLine.data.push(avg);
    });

    // Step 4: Update ECharts option
    option.value = {
      tooltip: {
        /* your tooltip config */
      },
      color: [
        "#B37676", "#B38E64", "#B3A564", "#86B382",
        "#FFD9D6", "#D9E6FF", "#D4FFD4", "#FFE6B3",
        "#B39C64", "#8686B3", "#B37699", "#7D9CB3",
        "#FFF0B3", "#E0E0FF", "#FFD6E8", "#E6F2FF"
      ],
      toolbox: {
        /* your toolbox config */
      },
      grid: {
        top: '22%',
        left: '1%',
        right: '10%',
        containLabel: true
      },
      legend: {
        data: [...categories, "Trend"],
        selected: Array.from(categories).reduce((obj, key) => ({ ...obj, [key]: false }), {}),
      },
      xAxis: [
        {
          type: "category",
          data: xAxisData,
          axisPointer: {
            type: "shadow",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Spending",
        },
      ],
      series: [...seriesData, trendLine],
    };
  }
  return {option, render};
}
