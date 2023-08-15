import { Ref, ref, watch } from "vue";
import { supabase } from "./supabase";

export interface AccountTransaction {
  id: string; // UUID
  showclock: boolean | null;
  displaydate: string | null; // VARCHAR(255)
  footer: string | null; // VARCHAR(255)
  title: string | null; // VARCHAR(255)
  strikethrough: boolean | null;
  kind: string | null; // VARCHAR(255)
  postdate: string | null; // Date in appropriate format
  detail: string | null; // VARCHAR(255)
  amount: number | null; // NUMERIC(10, 2)
}


export const useAcountTransactions = (dates: Ref<string[]>, filter: any = null) => {
  const accTransactions = ref([] as AccountTransaction[]);
  const totalAccTransactions = ref(0);

  const transform = (data: any) => {
    return data.map((item: any) => {
      return {
        ...item
      } as AccountTransaction
    });
  };

  const fetchTotalCount = async () => {
    const table = "account_transactions";
    if(!filter){

    }
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .neq("title", "Dinheiro resgatado")
      .neq("title", "Dinheiro guardado")
      .not("detail", "ilike", "AVENUE SECURITIES DTVM LTDA%")
      .not("detail", "ilike", "Lucas Garcia%")
      .gt("postdate", dates.value[0])
      .lte("postdate", dates.value[1]);
    totalAccTransactions.value = count || 0;
  };

  watch(() => dates.value, async (newDate) => {
      const table = "account_transactions";
      const { data } = await supabase
        .from(table)
        .select("*")
        .gt("postdate", newDate[0])
        .lte("postdate", newDate[1])
        .neq("title", "Dinheiro resgatado")
        .neq("title", "Dinheiro guardado")
        // don't include any detail with the words AVENUE SECURITIES DTVM LTDA 
        .not("detail", "ilike", "AVENUE SECURITIES DTVM LTDA%")
        .not("detail", "ilike", "Lucas Garcia%")
        .order("postdate", { ascending: false });
      accTransactions.value = transform(data);
  
      // Fetch total count if needed (only once or when data changes)
      fetchTotalCount();
    },
    { immediate: true, deep: true }
  );
  
  return { accTransactions, totalAccTransactions}
}