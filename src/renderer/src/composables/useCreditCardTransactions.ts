import { supabase } from "./supabase";
import { Ref, ref, watch } from "vue";
import { TypeMergeData } from "./useMergeTransaction";
import _ from "lodash";

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
  recurrent: boolean | null;
  method_payment: string | null;
  impact: string | null;
  comments: string | null;
}

// New helper function to build and execute transaction queries
async function fetchTransactions(query: string | null = null, startDate?: Date, endDate?: Date) {
  let q = supabase.from("transactions").select("*").order("time", { ascending: false });
  if (query) q = q.ilike("description", `%${query}%`);
  if (startDate) q = q.gte("time", startDate.toJSON());
  if (endDate) q = q.lte("time", endDate.toJSON());
  const { data } = await q;
  return data;
}

export const useCreditCardTransactions = (dates: Ref<{startDate: Date, endDate: Date}>) => {
  const transactions = ref([] as Transaction[]);
  const totalTransactions = ref(0);

  const transform = (data: any) => {
    return data.map((item: any) => {
      return {
        ...item,
        amount: (item.amount / 100),
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
      .gte("time", dates.value.startDate.toJSON())
      .lte("time", dates.value.endDate.toJSON());
    totalTransactions.value = count ?? 0;
  };

  async function updateCreditCardCategory(data: TypeMergeData){
    return await supabase
      .from("transactions")
      .update({ 
        category_id: data.categoryId,
        description: data.description,
        impact: data.impact,
        recurrent: data.recurrent,
        comments: data.comments,
       })
      .eq("id", data.id);
  }


  async function searchCreditCard(query: string, selectedMonth?: Date) {
    if (selectedMonth) {
      selectedMonth.setDate(1);
      selectedMonth.setHours(0, 0, 0, 0);
      const lastDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
      transactions.value = transform(await fetchTransactions(query, selectedMonth, lastDay));
    } else {
      transactions.value = transform(await fetchTransactions(query));
    }
    fetchTotalCount();
  }

  watch(() => dates.value, async (newDate) => {
    if (!newDate) return;
    newDate.endDate.setHours(23, 59, 59, 999);
    transactions.value = transform(await fetchTransactions(null, newDate.startDate, newDate.endDate));
    fetchTotalCount();
  }, { immediate: true, deep: true });
  
  return { transactions, totalTransactions, searchCreditCard, updateCreditCardCategory }
};
