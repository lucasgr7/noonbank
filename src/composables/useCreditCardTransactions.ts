import { supabase } from "./supabase";
import { ref, watch } from "vue";
import { TypeMergeData } from "./useMergeTransaction";

export interface Transaction {
  detailsStatus: string | null; // VARCHAR(255)
  description: string | null; // VARCHAR(255)
  amount: number | null; // Integer
  amountWithoutIof: number | null; // Integer
  detailsFxExchangeRate: number | null; // NUMERIC(10, 5)
  title: string | null; // VARCHAR(255)
  detailsFxPreciseAmountUsd: number | null; // NUMERIC(10, 5)
  id: string; // UUID
  account: string | null; // UUID
  category: string | null; // VARCHAR(255)
  detailsSubcategory: string | null; // VARCHAR(255)
  detailsFxCurrencyOrigin: string | null; // VARCHAR(255)
  time: string | null; // Timestamp without time zone
  detailsChargesAmount: number | null; // NUMERIC(10, 5)
  detailsFxAmountUsd: boolean | null;
  category_id: number | null;
}


export const useCreditCardTransactions = (dates: Ref<string[]>) => {
  const transactions = ref([] as Transaction[]);
  const totalTransactions = ref(0);

  const transform = (data: any) => {
    return data.map((item: any) => {
      return {
        ...item,
        amount: (item.amount / 100).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        time: new Date(item.time).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
      } as Transaction;
    });
  };

  const fetchTotalCount = async () => {
    const { count } = await supabase
      .from("transactions")
      .select("*", { count: "exact" })
      .gte("time", dates.value[0])
      .lte("time", dates.value[1]);
    totalTransactions.value = count || 0;
  };

  async function updateCreditCardCategory(data: TypeMergeData){
    return await supabase
      .from("transactions")
      .update({ category_id: data.categoryId })
      .eq("id", data.id);
  }

  watch(() => dates.value, async (newDate) => {
      const table = "transactions";
      const { data } = await supabase
        .from(table)
        .select("*")
        .gte("time", newDate[0])
        .lte("time", newDate[1])
        .order("time", { ascending: false });
      transactions.value = transform(data);
  
      // Fetch total count if needed (only once or when data changes)
      fetchTotalCount();
    },
    { immediate: true, deep: true }
  );
  
  return { transactions, totalTransactions, updateCreditCardCategory}
};
