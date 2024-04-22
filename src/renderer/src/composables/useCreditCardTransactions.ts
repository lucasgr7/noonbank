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
       })
      .eq("id", data.id);
  }


  async function searchCreditCard(query: string){
    const table = "transactions";
    const { data } = await supabase
      .from(table)
      .select("*")
      .order("time", { ascending: false })
      .ilike("description", `%${query}%`)
    transactions.value = transform(data);

    // Fetch total count if needed (only once or when data changes)
    fetchTotalCount();
  }

  watch(() => dates.value, async (newDate) => {
    if(!newDate) return;
    const table = "transactions";
    // add 23:59:59 to endDate
    newDate.endDate.setHours(23, 59, 59, 999);
    const { data } = await supabase
      .from(table)
      .select("*")
      .gte("time", newDate.startDate.toJSON())
      .lte("time", newDate.endDate.toJSON())
      .order("time", { ascending: false });
    // check if has no property data.data pass data to transform
    if(_.has(data, 'data')){
      transactions.value = transform(data.data);
    }
    else{
      transactions.value = transform(data);
    }

    // Fetch total count if needed (only once or when data changes)
    fetchTotalCount();
    },
    { immediate: true, deep: true }
  );
  
  return { transactions, totalTransactions, searchCreditCard, updateCreditCardCategory}
};
