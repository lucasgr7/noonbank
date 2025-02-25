import { Ref, ref, toRaw, watch } from "vue";
import { supabase } from "./supabase";
import { TypeMergeData } from "./useMergeTransaction";
import { generateGuid } from "../helper";

export interface AccountTransaction {
  id: string; // UUID
  displaydate: string | null; // VARCHAR(255)
  footer: string | null; // VARCHAR(255)
  title: string | null; // VARCHAR(255)
  kind: string | null; // VARCHAR(255)
  postdate: string | null; // Date in appropriate format
  detail: string | null; // VARCHAR(255)
  amount: number | null; // NUMERIC(10, 2)
  strikethrough: boolean | null;
  showclock: boolean | null;
  category_id: number | null;
  recurrent: boolean | null;
  method_payment: string | null;
  impact: string | null;
  comments: string | null;
}

export const useAcountTransactions = (dates?: Ref<{startDate: Date, endDate: Date}>, filter: any = null) => {
  const accTransactions = ref([] as AccountTransaction[]);
  const totalAccTransactions = ref(0);

  const transform = (data: any) => {
    return data
  };

  const fetchTotalCount = async () => {
    const table = "account_transactions";
    if(!filter){
      return null;
    }
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .neq("title", "Dinheiro resgatado")
      .neq("title", "Dinheiro guardado")
      .neq("title", "Pagamento da fatura")
      .not("detail", "ilike", "AVENUE SECURITIES DTVM LTDA%")
      .not("detail", "ilike", "Lucas Garcia%")
      .gte("postdate", dates.value.startDate.toJSON())
      .lte("postdate", dates.value.endDate.toJSON());
    totalAccTransactions.value = count ?? 0;
  };

  async function updateAccountCategory(data: TypeMergeData){
    const table = "account_transactions";
    return await supabase
      .from(table)
      .update({ 
        category_id: data.categoryId,
        detail: data.description,
        amount: data.amount,
        method_payment: data.method_payment,
        impact: data.impact,
        recurrent: data.recurrent,
        comments: data.comments,
       })
      .match({ id: data.id });
  }
  async function insertAccountTransanction(data: AccountTransaction){
    const table = "account_transactions";
    // generate guid
    data.id = generateGuid();
    data.kind = 'DELETE';
    return supabase
      .from(table)
      .insert(toRaw(data));
       
  }

  async function searchAccountTransaction(query: string, selectedMonth?: Date){
    const table = "account_transactions";
    
    // Start building the base query with common conditions
    let baseQuery = supabase
      .from(table)
      .select("*")
      .neq("title", "Dinheiro resgatado")
      .neq("title", "Dinheiro guardado")
      .neq("title", "Pagamento da fatura")
      .not("detail", "ilike", "AVENUE SECURITIES DTVM LTDA%")
      .not("detail", "ilike", "Lucas Garcia%")
      .ilike("detail", `%${query}%`);
  
    if(selectedMonth){
      // Set selectedMonth to the first day of its month at midnight
      selectedMonth = new Date(selectedMonth);
      selectedMonth.setDate(1);
      selectedMonth.setHours(0, 0, 0, 0);
      const lastDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
      baseQuery = baseQuery
        .gte("postdate", selectedMonth.toJSON())
        .lte("postdate", lastDay.toJSON());
    }
  
    // Add ordering condition
    const { data } = await baseQuery.order("postdate", { ascending: false });
    accTransactions.value = transform(data);
  
    // Fetch total count if needed
    fetchTotalCount();
  }

  async function deleteAccountTransaction(id: string){
    const table = "account_transactions";
    return await supabase
      .from(table)
      .delete()
      .match({ id: id });
  }

  if(dates !== null){
    watch(() => dates.value, async (newDate) => {
      if(!newDate) return;
      const table = "account_transactions";
      const { data } = await supabase
        .from(table)
        .select("*")
        .gte("postdate", newDate.startDate.toJSON())
        .lte("postdate", newDate.endDate.toJSON())
        .neq("title", "Dinheiro resgatado")
        .neq("title", "Dinheiro guardado")
        .neq("title", "Pagamento da fatura")
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
  }
  
  return { accTransactions, 
    totalAccTransactions, 
    updateAccountCategory, 
    insertAccountTransanction,
    searchAccountTransaction,
    deleteAccountTransaction}
}