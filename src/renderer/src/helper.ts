
// function to normalize date to a common format
export function normalizeDate(date: string | null): Date {
  if(!date) return new Date();
  if (date.includes('/')) { // '13/08/2023, 00:56:35' format
    const [day, month, rest] = date.split('/');
    const [year, time] = rest.split(', ');
    return new Date(`${year}-${month}-${day}T${time}`);
  }
  return new Date(date); // '2023-08-01' format
}

export function timeFormatter(row: any) {
  const date = new Date(row.time); // assuming row.time is a valid Date string
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// money formatter function, receive float returns brazilian R$
export function moneyFormatter(row: any) {
  return row.amount.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function checkType(type: string | null) {
  if (!type) {
    return '🔴'
  }
  // validate if TRANSFERENCIA RECEBIDA returns emoji green else red
  if (type === 'Transferência recebida') {
    return '🟢'
  }
  return '🔴';
}

export function checkTypeValue(type: string | null){
  if(!type){
    return 'minus';
  }
  if(type === 'Transferência recebida'){
    return 'plus';
  }
  return 'minus';
}

// generate guid in this format 64df5a42-97a9-42e9-bde5-94421fe3a6bf
export function generateGuid() : string {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}