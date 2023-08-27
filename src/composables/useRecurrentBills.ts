import { useSupaTable } from "./useSupaTable";

export interface recurrent_bills {
  id: any;
  label: any;
  key: any;
}

const columns = {
  "id": {
    "type": "key",
    "nullable": false
  },
  "label": {
    "type": "string",
    "nullable": true
  },
  "key": {
    "type": "string",
    "nullable": false
  }
};

export function useRecurrentBills(){
  return useSupaTable<recurrent_bills>("recurrent_bills", columns);
}