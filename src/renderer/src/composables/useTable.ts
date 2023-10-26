import { Ref, computed, ref } from "vue";


export function useTable(data: Ref, keyColumnFilter: string, calculateTotal = false){
  
  const pageSize = ref(10);
  const currentPage = ref(1);
  const search = ref('');
  const totalNumerOfLines = ref(0);
  const totalGain = ref(0);
  const totalCost = ref(0);
  const sortingColumn = ref({
    order: 'descending', // or 'descending'
    prop: 'time', // property to sort by
  });

  function handleSizeChange(newSize: number) {
    pageSize.value = newSize;
    currentPage.value = 1; // Reset to first page when page size changes
  }
  function handleCurrentChange(newPage: number) {
    currentPage.value = newPage;
  }
  function columnSort({ prop, order }: any) {
    sortingColumn.value = { prop, order };
  }
  function handleSearch(value: string) {
    search.value = value;
  }

  function calculateTotals(){
    totalGain.value = 0;
    totalCost.value = 0;
    totalNumerOfLines.value = data.value.length;
    data.value.forEach((item: any) => {
      if (item.typeValue === "plus") {
        totalGain.value += item.amount;
      } else if (item.typeValue === "minus") {
        totalCost.value += item.amount;
      }
    });
  }


  const chunckedData = computed(() => {
    const { order, prop } = sortingColumn.value;

    if(calculateTotal) calculateTotals();
  
    if(search.value){
      const result = data.value.filter((item: any) => {
        return item[keyColumnFilter].toLowerCase().includes(search.value.toLowerCase());
      })
      return result;
    }

    // Sort the data based on the specified column and order
    let sortedData = data.value;
    if (prop && order) {
      sortedData.sort((a, b) => {
        if (order === 'ascending') {
          return a[prop] > b[prop] ? 1 : -1;
        } else if (order === 'descending') {
          return a[prop] < b[prop] ? 1 : -1;
        }
        return 0;
      });
    }

    // Chunk the sorted data based on the current page and page size
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sortedData.slice(start, end);
  });

  return {
    chunckedData,
    handleSizeChange,
    handleCurrentChange,
    handleSearch,
    columnSort,
    totalNumerOfLines,
    pageSize,
    currentPage,
    search,
    totalGain,
    totalCost
  }
}