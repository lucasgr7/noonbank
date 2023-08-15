import { Ref, computed } from "vue";
import { AccountTransaction, useAcountTransactions } from "./useAcountTransactions";
import { Transaction, useCreditCardTransactions } from "./useCreditCardTransactions";
import { checkType, checkTypeValue, normalizeDate } from "../helper";

export interface TypeMergeData {
  type: string;
  typeValue: 'minus' | 'plus';
  description: string;
  amount: number | string;
  category: string;
  time: Date;
}

export function useMergeTransaction(dates: Ref<string[]>){
  const { transactions, totalTransactions } = useCreditCardTransactions(dates);
  const { accTransactions, totalAccTransactions } = useAcountTransactions(dates);

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
        type: checkType(x.title),
        typeValue: checkTypeValue(x.title),
        description:  x.title + ' ' + x.detail,
        amount: convertToNumber(x.amount),
        category: x.kind,
        time: normalizeDate(x.postdate) // assuming this is in the '2023-08-01' format
      }
    });
    const credit = transactions.value.map((x: Transaction) => {
      return {
        // type: emoji red
        type: '🔴',
        typeValue: 'minus',
        description: x.title + ' ' + x.description,
        amount: convertToNumber(x.amount),
        category: x.category,
        time: normalizeDate(x.time) // assuming this can be in the '13/08/2023, 00:56:35' format
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
  return {mergeData, totalTransactions, totalAccTransactions, accTransactions, transactions}
}