import { useSupaTable } from "./useSupaTable";


export interface snapshot_recurrnt_bills {
  id?: any;
  date: Date;
  value: any;
  reccurent_id: any;
}


const columns = {
  "id": {
    "type": "key",
    "nullable": true
  },
  "date": {
    "type": "date",
    "nullable": false
  },
  "value": {
    "type": "decimal",
    "nullable": false
  },
  "reccurent_id": {
    "type": "number",
    "nullable": false
  }
};

export function useSnapshotRecurrentBills() {
  return useSupaTable<snapshot_recurrnt_bills>("snapshot_recurrnt_bills", columns);
}