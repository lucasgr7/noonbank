import { Ref, computed } from "vue";
import { AccountTransaction, useAcountTransactions } from "./useAcountTransactions";
import { Transaction, useCreditCardTransactions } from "./useCreditCardTransactions";
import { checkType, checkTypeValue, normalizeDate } from "../helper";

export interface TypeMergeData {
  signal: string;
  typeValue: 'minus' | 'plus';
  description: string;
  amount: number | string;
  category: string;
  time: Date;
  type: 'credit' | 'account';
  id: string;
  categoryId?: number | null;
  impact?: string;
  recurrent?: boolean;
  comments?: string;
  method_payment?: string;
}

export function useMergeTransaction(dates: Ref<{startDate: Date, endDate: Date}>){
  const { transactions, 
    totalTransactions, 
    updateCreditCardCategory,
  searchCreditCard } = useCreditCardTransactions(dates);
  const { accTransactions, 
    totalAccTransactions, 
    updateAccountCategory,
    searchAccountTransaction,
    deleteAccountTransaction } = useAcountTransactions(dates);

  const mergeData = computed(() => {

  const convertToNumber = (amount: string | number) => {
    let result: number;
    if (typeof amount === 'string') {
      result = parseFloat(amount.replace(/,/g, ".").replace(/[^0-9.-]+/g, ""));
    } else {
      result = amount;
    }
    return parseFloat(result.toFixed(2));
  }
    const acc = accTransactions.value.map((x: AccountTransaction) => {
      return {
        signal: checkType(x.title),
        typeValue: checkTypeValue(x.title),
        description:  `${x.title} - ${x.detail}`,
        amount: convertToNumber(x.amount),
        category: x.kind,
        time: normalizeDate(x.postdate), // assuming this is in the '2023-08-01' format
        type: 'account',
        id: x.id,
        categoryId: x.category_id,
        impact: x.impact,
        recurrent: x.recurrent,
        comments: x.comments,
        method_payment: x.method_payment
      }
    });
    const credit = transactions.value.map((x: Transaction) => {
      return {
        // type: emoji red
        signal: '🔴',
        typeValue: 'minus',
        description: x.description,
        amount: convertToNumber(x.amount),
        category: x.category,
        time: normalizeDate(x.time), // assuming this can be in the '13/08/2023, 00:56:35' format
        type: 'credit',
        id: x.id,
        categoryId: x.category_id,
        impact: x.impact,
        recurrent: x.recurrent,
        comments: x.comments,
      }
    });

    // merge two arrays
    const merged = [...acc, ...credit];

    // sort by time
    merged.sort((a, b) => {
      const dateA = a.time;
      const dateB = b.time;
      return dateB.getTime() - dateA.getTime();
    });
    return merged as TypeMergeData[];
  });

  function search(query: string, selectedMonth?: Date){
    const resultCreditCard = searchCreditCard(query, selectedMonth);
    const resultAccount = searchAccountTransaction(query, selectedMonth);
    return Promise.all([resultCreditCard, resultAccount]);
  }
  return {mergeData, 
    totalTransactions, 
    search, 
    totalAccTransactions, 
    accTransactions, 
    transactions, 
    updateAccountCategory, 
    updateCreditCardCategory,
    deleteAccountTransaction
  }
}