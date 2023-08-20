export interface test {
  id: number;,
  name: string?;
}

const columns = {
  "id": {
    "type": "integer",
    "nullable": false
  },
  "name": {
    "type": "varchar",
    "nullable": true
  }
};