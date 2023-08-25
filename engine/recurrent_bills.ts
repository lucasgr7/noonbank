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