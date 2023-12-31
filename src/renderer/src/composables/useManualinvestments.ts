import { useSupaTable } from "./useSupaTable";

export interface investments_manual {
  id: number;
  name?: string;
  value?: any;
}

const columns = {
  "id": {
    "type": "key",
    "nullable": false
  },
  "name": {
    "type": "varchar",
    "nullable": true
  },
  "value": {
    "type": "number",
    "nullable": true
  }
};

export function useManualinvestments() {
  return useSupaTable<investments_manual>("investments_manual", columns);
}