import { useTable } from "./useTable";

export interface investments_manual {
  id: any;
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
  return useTable<investments_manual>("investments_manual", columns);
}